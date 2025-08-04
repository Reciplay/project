package com.e104.reciplay.common.exception;

public class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(Long id) { super("해당 ID의 강좌를 찾을 수 없습니다: " + id); }
}
