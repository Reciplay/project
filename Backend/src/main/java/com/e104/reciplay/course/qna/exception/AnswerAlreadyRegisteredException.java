package com.e104.reciplay.course.qna.exception;

public class AnswerAlreadyRegisteredException extends RuntimeException{
    public AnswerAlreadyRegisteredException(String msg) {
        super(msg);
    }
}
