package com.example.decentraback.services;


import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ProcessInstanceEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AppZeebeClient {
    private final ZeebeClient zeebeClient;

    public ProcessInstanceEvent startInstance(String bpmnProcessId, Object variables) {
        return zeebeClient
                .newCreateInstanceCommand()
                .bpmnProcessId(bpmnProcessId)
                .latestVersion()
                .variables(variables)
                .send()
                .join();
    }

}
