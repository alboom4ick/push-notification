// Request.java
package com.example.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "requests")
@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class Request {

    @Id
    private String id; // ObjectId как строка

    /** ключ инстанса процесса (Zeebe) */
    @Field("req_id")
    @Indexed
    private Long reqId;

    /** время запроса (UTC) */
    @Field("request_time")
    private String requestTime;

    private String status;

    /** любые ключ-значения из ответов API */
    @Field("data_keys")
    @Builder.Default
    private Map<String, Object> dataKeys = new HashMap<>();

    public Request put(String key, Object value) {
        this.dataKeys.put(key, value);
        return this;
    }

    @CreatedDate
    @Field("created_at")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private Instant updatedAt;
}
