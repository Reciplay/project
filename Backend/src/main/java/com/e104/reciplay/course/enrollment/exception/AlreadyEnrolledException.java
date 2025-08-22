package com.e104.reciplay.course.enrollment.exception;

public class AlreadyEnrolledException extends RuntimeException{
    public AlreadyEnrolledException(String msg) {
        super(msg);
    }
}
