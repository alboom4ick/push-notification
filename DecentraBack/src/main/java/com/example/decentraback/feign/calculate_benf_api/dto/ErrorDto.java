package com.example.decentraback.feign.calculate_benf_api.dto;

import lombok.Data;

@Data
public class ErrorDto {
    private String code;     // например: CLIENT_NOT_FOUND
    private String message;  // например: "Client with ID -1 not found"
}
