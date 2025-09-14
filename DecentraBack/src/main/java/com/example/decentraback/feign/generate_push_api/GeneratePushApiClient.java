package com.example.decentraback.feign.generate_push_api;

import com.example.decentraback.config.FeighApiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeneratePushApiClient {
    private final FeighApiConfig feighApiConfig;
    private final RestTemplate restTemplate;

    public Object generatePush(Map<String, Object> vars) {
        return post(feighApiConfig.getGeneratePushApi() + "/generate-push-notification", vars, Object.class);
    }

    private <T> T post(String url, Object request, Class<T> responseType) {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        var entity = new HttpEntity<>(request, h);

        try {
            return restTemplate.postForEntity(url, entity, responseType).getBody();
        } catch (Exception e) {
            log.info("Exception: ", e);
            return null;
        }
    }
}
