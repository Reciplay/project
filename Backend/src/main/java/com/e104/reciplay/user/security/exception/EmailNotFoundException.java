package com.e104.reciplay.user.security.exception;

import jakarta.validation.constraints.Email;

public class EmailNotFoundException extends RuntimeException{
    public EmailNotFoundException(String msg) {
        super(msg);
    }
}
