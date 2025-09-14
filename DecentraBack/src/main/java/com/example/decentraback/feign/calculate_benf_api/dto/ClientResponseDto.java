package com.example.decentraback.feign.calculate_benf_api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClientResponseDto<T> {
    private boolean success;
    private OffsetDateTime timestamp;

    @JsonProperty("request_datetime")
    private OffsetDateTime requestDatetime;

    private ClientDto client;   // при success=true
    private AnalysisDto analysis;   // при success=true
    private ErrorDto error;     // при success=false
}