package com.e104.reciplay.security.exception;

public class DuplicateUserEmailException extends RuntimeException{
    public DuplicateUserEmailException(String msg) {
        super(msg);
    }
}
