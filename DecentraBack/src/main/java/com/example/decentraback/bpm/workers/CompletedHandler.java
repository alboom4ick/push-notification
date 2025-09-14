package com.example.decentraback.bpm.workers;

import com.example.decentraback.bpm.enums.JobTypeNames;
import com.example.decentraback.repositories.RequestRepository;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.exception.ZeebeBpmnError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CompletedHandler {
    private final RequestRepository requestRepository;

    public CompletedHandler(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @JobWorker(type = JobTypeNames.CHANGE_STATUS_COMPLETED)
    public void handleChangeStatusCompleted(final ActivatedJob activatedJob) {
        log.info("Change status completed");
        var req = requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                .orElseThrow(() -> new ZeebeBpmnError("REQUEST_NOT_FOUND", "Request not found: " + activatedJob.getProcessInstanceKey() + ""));
        req.setStatus("completed");
        requestRepository.save(req);
    }

}
