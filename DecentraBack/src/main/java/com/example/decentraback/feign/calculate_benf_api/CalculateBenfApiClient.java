package com.example.decentraback.feign.calculate_benf_api;

import com.example.decentraback.config.FeighApiConfig;
import com.example.decentraback.feign.calculate_benf_api.dto.ClientResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;


@Slf4j
@Component
@RequiredArgsConstructor
public class CalculateBenfApiClient {
    private final FeighApiConfig feighApiConfig;
    private final RestTemplate restTemplate;

    public ClientResponseDto fetchClientId(String clientId) {
        HashMap<String, Object> vars = new HashMap<>();
        vars.put("client_id", clientId);
        return post(feighApiConfig.getCalculateBenfApi() + "/bcc-active-user", vars, ClientResponseDto.class);
    }

    public ClientResponseDto fetchClientBenefits(String clientId) {
        HashMap<String, Object> vars = new HashMap<>();
        vars.put("client_id", clientId);
        return post(feighApiConfig.getCalculateBenfApi() + "/bcc-benefit-card", vars, ClientResponseDto.class);
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
