package com.example.decentraback.bpm.enums;

import lombok.Getter;

@Getter
public enum Variable {
    USER_INFO("user_info");

    private final String value;

    Variable(String value) {
        this.value = value;
    }
}
