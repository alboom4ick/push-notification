package com.example.decentraback.feign.calculate_benf_api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AnalysisDto {
    @JsonProperty("client_id")
    private Long clientId;

    private String name;

    @JsonProperty("current_product")
    private String currentProduct;

    @JsonProperty("best_product")
    private String bestProduct;

    @JsonProperty("second_best_product")
    private String secondBestProduct;

    @JsonProperty("notification_product")
    private String notificationProduct;

    @JsonProperty("best_score")
    private Double bestScore;

    @JsonProperty("second_best_score")
    private Double secondBestScore;

    private String status;
}
