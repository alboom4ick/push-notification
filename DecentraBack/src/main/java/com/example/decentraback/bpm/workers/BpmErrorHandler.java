package com.example.decentraback.bpm.workers;

import java.util.HashMap;
import java.util.Map;

import com.example.decentraback.bpm.enums.JobTypeNames;
import com.example.decentraback.repositories.RequestRepository;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.exception.ZeebeBpmnError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


@Component
@Slf4j
public class BpmErrorHandler {
    private final RequestRepository requestRepository;

    public BpmErrorHandler(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @JobWorker(type = JobTypeNames.ERROR_HANDLER)
    public Map<String, Object> handleError(final ActivatedJob activatedJob) {
        log.error("Error in BPM");
        var req = requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                .orElseThrow(() -> new ZeebeBpmnError("REQUEST_NOT_FOUND", "Request not found: " + activatedJob.getProcessInstanceKey() + ""));
        req.setStatus("error");
        requestRepository.save(req);
        return new HashMap<>();
    }
}
