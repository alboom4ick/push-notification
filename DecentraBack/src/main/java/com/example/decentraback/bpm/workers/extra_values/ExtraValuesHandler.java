package com.example.decentraback.bpm.workers.extra_values;


import com.example.decentraback.bpm.enums.JobTypeNames;
import com.example.decentraback.feign.extra_values_api.ExtraValuesApiClient;
import com.example.decentraback.repositories.RequestRepository;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class ExtraValuesHandler {
    private final ExtraValuesApiClient extraValuesApiClient;
    private final RequestRepository requestRepository;

    @JobWorker(type = JobTypeNames.FETCH_KZ_CALENDAR)
    public void handleFetchKZCalendar(final ActivatedJob activatedJob) {
        log.info("Fetch kz calendar");

        var res = extraValuesApiClient.fetchCalendar();
        if (res != null) {

            requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                    .ifPresent(request -> {
                        request.getDataKeys().put("kz_calendar", res);
                        requestRepository.save(request);
                    });
        }
    }

    @JobWorker(type = JobTypeNames.FETCH_EVENTS)
    public void handleFetchEvents(final ActivatedJob activatedJob) {
        log.info("Fetch events");

        var res = extraValuesApiClient.fetchKzEvents();
        if (res != null) {

            requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                    .ifPresent(request -> {
                        request.getDataKeys().put("event_calendar", res);
                        requestRepository.save(request);
                    });
        }
    }

    @JobWorker(type = JobTypeNames.FETCH_PUSH_NOTIFICATION_RULES)
    public void handleFetchPushNotificationRules(final ActivatedJob activatedJob) {
        log.info("Fetch push notification rules");

        var res = extraValuesApiClient.fetchRules();
        var templates = extraValuesApiClient.fetchTemplates();

        if (res != null) {
            requestRepository.findByReqId(activatedJob.getProcessInstanceKey())
                    .ifPresent(request -> {
                        request.getDataKeys().put("tone_of_voice", res);
                        request.getDataKeys().put("examples_of_push_notifications", templates);


                        requestRepository.save(request);
                    });
        }
    }


}
