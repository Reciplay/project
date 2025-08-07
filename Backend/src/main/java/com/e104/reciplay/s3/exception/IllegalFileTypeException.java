package com.e104.reciplay.s3.exception;

public class IllegalFileTypeException extends RuntimeException{
    public IllegalFileTypeException(String msg) {
        super(msg);
    }
}
