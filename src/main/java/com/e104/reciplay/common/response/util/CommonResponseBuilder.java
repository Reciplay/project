package com.e104.reciplay.common.response.util;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public class CommonResponseBuilder {
    private static final String successMessage = "success";
    private static final String failureMessage = "fail";

    public static <T> ResponseEntity<ResponseRoot<T>> success(String message, T data) { // 200
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON)
                .body(new ResponseRoot<T>(successMessage, message, data));
    }

    public static <T> ResponseEntity fail(String message) { // 400
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON)
                .body(new ResponseRoot(failureMessage, message, null));
    }

    public static ResponseEntity<?> create(String message, Object data) { // 201
        return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON)
                .body(ResponseRoot.builder().status(successMessage).message(message).data(data).build());
    }

    public static ResponseEntity notFound(String message) { // 404
        return ResponseEntity.status(HttpStatus.NOT_FOUND).contentType(MediaType.APPLICATION_JSON)
                .body(ResponseRoot.builder().status(failureMessage).message(message).build());
    }

    public static ResponseEntity unauthorized(String message) { // 403
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).contentType(MediaType.APPLICATION_JSON)
                .body(ResponseRoot.builder().status(failureMessage).message(message).build());
    }
}
