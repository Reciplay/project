package com.e104.reciplay.common.response.util;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public class CommonResponseBuilder {
    private static final String successMessage = "success";
    private static final String failureMessage = "fail";

    public static ResponseEntity<?> success(String message, Object data) {
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON)
                .body(ResponseRoot.builder().status(successMessage).message(message).data(data).build());
    }

    public static ResponseEntity<?> fail(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON)
                .body(ResponseRoot.builder().status(failureMessage).message(message).build());
    }

    public static ResponseEntity<?> create(String message, Object data) {
        return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON)
                .body(ResponseRoot.builder().status(successMessage).message(message).data(data).build());
    }

    public static ResponseEntity<?> notFound(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).contentType(MediaType.APPLICATION_JSON)
                .body(ResponseRoot.builder().status(failureMessage).message(message).build());
    }
}
