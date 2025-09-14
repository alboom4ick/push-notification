package com.example.decentraback.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter @Setter
@Component
@ConfigurationProperties(prefix = "application.feign-api")
public class FeighApiConfig {
    private String extraValuesUserApi;
    private String extraValuesApi;
    private String calculateBenfApi;
    private String generatePushApi;
}
