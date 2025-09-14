package com.example.decentraback;

import io.camunda.zeebe.spring.client.annotation.Deployment;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Deployment(resources = "classpath*:/processes/**/*.bpmn")
public class DecentraBackApplication {
    public static void main(String[] args) {
        SpringApplication.run(DecentraBackApplication.class, args);
    }
}
