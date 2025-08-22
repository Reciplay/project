package com.e104.reciplay.s3.exception;

public class FileMetadataNotFoundException extends RuntimeException{
    public FileMetadataNotFoundException(String msg) {
        super(msg);
    }
}
