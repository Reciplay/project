package com.e104.reciplay.common.handler;

import com.e104.reciplay.common.exception.CourseNotFoundException;
import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.livekit.exception.CanNotOpenLiveRoomException;
import com.e104.reciplay.livekit.exception.CanNotParticipateInLiveRoomException;
import com.e104.reciplay.livekit.exception.EmptyPropertyException;
import com.e104.reciplay.livekit.exception.RoomIdExpiredException;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Hidden
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CanNotOpenLiveRoomException.class)
    public ResponseEntity<?> canNotOpenLiveRoomExceptionHandler(CanNotOpenLiveRoomException e) {
        return CommonResponseBuilder.badRequest(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> illegalArtumentExceptionHandler(IllegalArgumentException e) {
        return CommonResponseBuilder.badRequest(e.getMessage());
    }

    @ExceptionHandler(InvalidUserRoleException.class)
    public ResponseEntity<?> invalidUserRoleExceptionHandler(InvalidUserRoleException e) {
        return CommonResponseBuilder.forbidden(e.getMessage());
    }

    @ExceptionHandler(CanNotParticipateInLiveRoomException.class)
    public ResponseEntity<?> canNotPariticipateIntLiveRoomExceptionHandler(CanNotParticipateInLiveRoomException e) {
        return CommonResponseBuilder.badRequest(e.getMessage());
    }

    @ExceptionHandler(CourseNotFoundException.class)
    public ResponseEntity<?> courseNotFoundExceptionHandler(CourseNotFoundException e) {
        return CommonResponseBuilder.notFound(e.getMessage());
    }
    @ExceptionHandler(LectureNotFoundException.class)
    public ResponseEntity<?> lectureNotFoundExceptionHandler(LectureNotFoundException e) {
        return CommonResponseBuilder.notFound(e.getMessage());
    }


    @ExceptionHandler(RoomIdExpiredException.class)
    public ResponseEntity<?> roomIdExpiredExceptionHandler(RoomIdExpiredException e) {
        return CommonResponseBuilder.badRequest(e.getMessage());
    }
}
