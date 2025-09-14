package com.example.decentraback.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RequestRepository extends MongoRepository<com.example.model.Request, String> {
    Optional<com.example.model.Request> findByReqId(Long reqId);
}
