package com.e104.reciplay.s3.exception;

public class TooBigFileSizeException extends RuntimeException{
    public TooBigFileSizeException(String msg) {
        super(msg);
    }
}
