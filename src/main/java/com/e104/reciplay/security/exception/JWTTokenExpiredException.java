package com.e104.reciplay.security.exception;

public class JWTTokenExpiredException extends RuntimeException{
    public JWTTokenExpiredException(String msg) {
        super(msg);
    }
}
