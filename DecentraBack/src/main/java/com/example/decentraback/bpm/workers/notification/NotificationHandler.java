package com.example.decentraback.bpm.workers.notification;


import com.example.decentraback.bpm.enums.JobTypeNames;
import com.example.decentraback.feign.generate_push_api.GeneratePushApiClient;
import com.example.decentraback.repositories.RequestRepository;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.model.bpmn.instance.IntermediateThrowEvent;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.exception.ZeebeBpmnError;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@RequiredArgsConstructor
@Component
@Slf4j
public class NotificationHandler {
    private final GeneratePushApiClient generatePushApiClient;
    private final RequestRepository requestRepository;

    @JobWorker(type = JobTypeNames.GENERATE_PUSH_NOTIFICATION)
    public void handleGeneratePushNotification(final ActivatedJob activatedJob) {
        log.info("Generate push notification");
        var req = requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                .orElseThrow(() -> new ZeebeBpmnError("REQUEST_NOT_FOUND", "Request not found: " + activatedJob.getProcessInstanceKey() + ""));

        var result = generatePushApiClient.generatePush(req.getDataKeys());
        req.getDataKeys().put("result", result);
        requestRepository.save(req);
    }
}
