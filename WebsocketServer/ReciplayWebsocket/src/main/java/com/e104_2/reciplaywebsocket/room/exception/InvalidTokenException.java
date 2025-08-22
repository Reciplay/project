package com.e104_2.reciplaywebsocket.room.exception;

public class InvalidTokenException extends RuntimeException{
    public InvalidTokenException(String msg) {
        super(msg);
    }
}
