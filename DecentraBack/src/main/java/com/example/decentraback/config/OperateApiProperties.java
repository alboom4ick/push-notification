package com.example.decentraback.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter @Setter
@Component
@ConfigurationProperties(prefix = "camunda.client.operate")
public class OperateApiProperties {
    private String baseUrl;
    private boolean authEnabled;
    private String username;
    private String password;
}
