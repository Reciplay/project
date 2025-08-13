package com.e104.reciplay.common.exception;

public class NotInstructorException extends RuntimeException {
    public NotInstructorException() {
        super("강사만 강좌를 등록할 수 있습니다.");
    }
}
