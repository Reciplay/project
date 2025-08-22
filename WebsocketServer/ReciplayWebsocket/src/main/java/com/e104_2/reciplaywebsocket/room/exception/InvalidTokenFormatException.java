package com.e104_2.reciplaywebsocket.room.exception;

public class InvalidTokenFormatException extends RuntimeException{
    public InvalidTokenFormatException(String msg) {
        super(msg);
    }
}
