package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.Instructor;

public interface InstructorQueryService {
    Instructor queryInstructorByEmail(String email);
}
