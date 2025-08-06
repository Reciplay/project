package com.e104.reciplay.user.auth.exception;

import org.springframework.security.core.parameters.P;

public class InvalidOtpHashException extends RuntimeException{
    public InvalidOtpHashException(String msg) {
        super(msg);
    }
}
