package com.e104_2.reciplaywebsocket.room.exception;

public class RoomIdExpiredException extends RuntimeException{
    public RoomIdExpiredException(String msg) {
        super(msg);
    }
}
