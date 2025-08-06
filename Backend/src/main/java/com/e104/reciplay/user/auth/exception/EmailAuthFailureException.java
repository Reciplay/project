package com.e104.reciplay.user.auth.exception;

public class EmailAuthFailureException extends RuntimeException{
    public EmailAuthFailureException(String msg) {
        super(msg);
    }
}
