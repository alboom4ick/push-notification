package com.example.decentraback.bpm.enums;

import lombok.Getter;

public final class JobTypeNames {
    public static final String ERROR_HANDLER = "error_handler";
    public static final String FETCH_CLIENT = "fetch_client";
    public static final String FETCH_BENEFITS = "fetch_benefits";
    public static final String FETCH_USER_EXTRA_FIELDS = "fetch_user_extra_fields";
    public static final String FETCH_KZ_CALENDAR = "fetch_kz_calendar";
    public static final String FETCH_EVENTS = "fetch_events";
    public static final String FETCH_PUSH_NOTIFICATION_RULES = "fetch_push_notification_rules";
    public static final String GENERATE_PUSH_NOTIFICATION = "generate_push_notification";
    public static final String CHANGE_STATUS_COMPLETED = "change_status_completed";
    private JobTypeNames() {}
}

