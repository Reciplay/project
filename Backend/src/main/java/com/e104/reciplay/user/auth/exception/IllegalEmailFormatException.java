package com.e104.reciplay.user.auth.exception;

public class IllegalEmailFormatException extends RuntimeException{
    public IllegalEmailFormatException(String msg) {
        super(msg);
    }
}
