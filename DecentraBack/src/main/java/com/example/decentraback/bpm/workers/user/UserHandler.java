package com.example.decentraback.bpm.workers.user;

import com.example.decentraback.bpm.enums.Variable;
import com.example.decentraback.feign.calculate_benf_api.CalculateBenfApiClient;
import com.example.decentraback.feign.extra_values_api.ExtraValuesApiClient;
import com.example.decentraback.repositories.RequestRepository;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.exception.ZeebeBpmnError;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static com.example.decentraback.bpm.enums.JobTypeNames.FETCH_CLIENT;
import static com.example.decentraback.bpm.enums.JobTypeNames.FETCH_USER_EXTRA_FIELDS;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserHandler {
    private final CalculateBenfApiClient calculateBenfApiClient;
    private final RequestRepository requestRepository;
    private final ExtraValuesApiClient extraValuesApiClient;

    @JobWorker(type = FETCH_USER_EXTRA_FIELDS)
    public Map<String, Object> handleFetchUserExtraFields(final ActivatedJob activatedJob) {
        log.info("Fetch user extra fields");
        var req = requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                .orElseThrow(() -> new ZeebeBpmnError("REQUEST_NOT_FOUND", "Request not found: " + activatedJob.getProcessInstanceKey() + ""));
        Map<String, Object> vars = new HashMap<>();

        vars.put("client_code", activatedJob.getVariablesAsMap().get("client_code"));
        vars.put("notification_product", req.getDataKeys().get("notification_product"));
        var res = extraValuesApiClient.fetchUserExtraFields(vars);
        var humor = extraValuesApiClient.fetchHumor();

        req.getDataKeys().put("extra_fields", res.getOrDefault("extra_fields", new HashMap<>()));
        req.getDataKeys().put("humor", humor.getOrDefault("level", 0));
        requestRepository.save(req);

        return new HashMap<>();
    }

    @JobWorker(type = FETCH_CLIENT)
    public Map<String, Object> handleFetchClient(final ActivatedJob activatedJob) {
        var vars = activatedJob.getVariablesAsMap();
        log.info("Fetch client, vars: {}", vars);

        var clientInfo = calculateBenfApiClient.fetchClientId(vars.get("client_code").toString());

        if (clientInfo != null && clientInfo.isSuccess()) {
            vars.put(Variable.USER_INFO.getValue(), true);
            requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                    .ifPresent(request -> {
                        request.getDataKeys().put(Variable.USER_INFO.getValue(), clientInfo.getClient());
                        requestRepository.save(request);
                    });
        }


        return vars;
    }
}
