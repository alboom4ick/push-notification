package com.example.decentraback.bpm.enums;

import lombok.Getter;

@Getter
public enum Process {
    CREATE_REQUEST("create_request");

    private final String value;

    Process(String value) {
        this.value = value;
    }
}
