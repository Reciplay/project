package com.e104.reciplay.user.security.exception;

public class JWTTokenExpiredException extends RuntimeException{
    public JWTTokenExpiredException(String msg) {
        super(msg);
    }
}
