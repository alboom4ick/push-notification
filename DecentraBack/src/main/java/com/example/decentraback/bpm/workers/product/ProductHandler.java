package com.example.decentraback.bpm.workers.product;


import com.example.decentraback.bpm.enums.JobTypeNames;
import com.example.decentraback.feign.calculate_benf_api.CalculateBenfApiClient;
import com.example.decentraback.repositories.RequestRepository;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Component
@Slf4j
public class ProductHandler {
    private final CalculateBenfApiClient calculateBenfApiClient;
    private final RequestRepository requestRepository;

    @JobWorker(type = JobTypeNames.FETCH_BENEFITS)
    public void handleFetchBenefits(final ActivatedJob activatedJob) {
        var vars = activatedJob.getVariablesAsMap();
        log.info("Fetch benefits, {}", vars);

        var res = calculateBenfApiClient.fetchClientBenefits(vars.get("client_code").toString());

        if (res != null && res.isSuccess()) {
            var ans = res.getAnalysis();
            requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                    .ifPresent(request -> {
                        request.getDataKeys().put("current_product", ans.getCurrentProduct());
                        request.getDataKeys().put("notification_product", ans.getNotificationProduct());
                        request.getDataKeys().put("best_product", ans.getBestProduct());
                        requestRepository.save(request);
                    });
        }
    }
}
