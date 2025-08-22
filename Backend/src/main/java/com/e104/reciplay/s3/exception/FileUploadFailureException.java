package com.e104.reciplay.s3.exception;

public class FileUploadFailureException extends RuntimeException{
    public FileUploadFailureException(String msg) {
        super(msg);
    }
}
