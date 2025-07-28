package com.e104.reciplay.user.security.exception;

public class DuplicateUserEmailException extends RuntimeException{
    public DuplicateUserEmailException(String msg) {
        super(msg);
    }
}
