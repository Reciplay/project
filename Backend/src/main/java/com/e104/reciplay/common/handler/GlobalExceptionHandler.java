package com.e104.reciplay.common.handler;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.livekit.exception.CanNotOpenLiveRoomException;
import com.e104.reciplay.livekit.exception.EmptyPropertyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
}
