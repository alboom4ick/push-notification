package com.example.decentraback.feign.calculate_benf_api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ClientDto {
    @JsonProperty("client_id")
    private Long clientId;
    private String name;
    private String status;
    private Integer age;
    private String city;

    @JsonProperty("avg_monthly_balance_KZT")
    private Long avgMonthlyBalanceKzt;
}
