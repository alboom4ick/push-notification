package com.example.decentraback.feign.extra_values_api;

import com.example.decentraback.config.FeighApiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@Component
public class ExtraValuesApiClient {
    private final FeighApiConfig feighApiConfig;
    private final RestTemplate restTemplate;

    public Object fetchRules() {
        return restTemplate.getForObject(feighApiConfig.getExtraValuesApi() + "/tomOfVoice", Object.class);
    }

    public Object fetchCalendar() {
        return restTemplate.getForObject(feighApiConfig.getExtraValuesApi() + "/calendar/kz/current", Object.class);
    }

    public Object fetchKzEvents() {
        return restTemplate.getForObject(feighApiConfig.getExtraValuesApi() + "/kz-events", Object.class);
    }

    public Map<String, Object> fetchUserExtraFields(Map<String, Object> vars) {
        return restTemplate.postForObject(feighApiConfig.getExtraValuesUserApi(), vars, Map.class);
    }

    public Map<String, Object> fetchHumor() {
        return restTemplate.getForObject(feighApiConfig.getExtraValuesApi() + "/humor", Map.class);
    }


    public Object fetchTemplates() {
        return restTemplate.getForObject(feighApiConfig.getExtraValuesApi() + "/templates", Object.class);
    }
}
