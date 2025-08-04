package com.e104.reciplay.common.exception;

public class LectureNotFoundException extends RuntimeException  {
    public LectureNotFoundException(Long id) { super("해당 ID의 강의를 찾을 수 없습니다: " + id); }
}
