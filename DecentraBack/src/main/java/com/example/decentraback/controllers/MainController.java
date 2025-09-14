package com.example.decentraback.controllers;

import com.example.decentraback.bpm.enums.Process;
import com.example.decentraback.repositories.RequestRepository;
import com.example.decentraback.services.AppZeebeClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;


@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
public class MainController {
    private final AppZeebeClient appZeebeClient;
    private final RequestRepository requestRepository; // todo: po fastu

    @PostMapping("/create-notification/{client-code}")
    long createNotification(@PathVariable("client-code") Integer clientCode, @RequestParam(value = "time", required = false) String time) {

        com.example.model.Request request = new com.example.model.Request();

        HashMap<String, Object> variables = new HashMap<>();
        variables.put("client_code", clientCode);
        var processInstance = appZeebeClient.startInstance(Process.CREATE_REQUEST.getValue(), variables);
        request.setReqId(processInstance.getProcessInstanceKey());
        request.setRequestTime(time);
        request.setStatus("created");
        requestRepository.save(request);

        return processInstance.getProcessInstanceKey();
    }

    @GetMapping("/notification/status/{key}")
    String getNotificationStatus(@PathVariable("key") Long key) {
        var req = requestRepository.findByReqId(key);
        if (req.isEmpty()) {
            return "not found";
        }
        return req.get().getStatus();
    }

    @GetMapping("/notification/result/{key}")
    Object getNotificationResult(@PathVariable("key") Long key) {
        var req = requestRepository.findByReqId(key);
        if (req.isEmpty() || req.get().getDataKeys() == null || !req.get().getDataKeys().containsKey("result")) {
            return "not found";
        }
        return req.get().getDataKeys().get("result");
    }

    @GetMapping("/notification/data-keys/{key}")
    Object getNotificationClientInfo(@PathVariable("key") Long key) {
        var req = requestRepository.findByReqId(key);
        if (req.isEmpty()) {
            return "not found";
        }
        return req.get().getDataKeys();
    }
}
