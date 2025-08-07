package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Instructor;

public interface InstructorQueryService {
    Instructor queryInstructorByEmail(String email);

    Long queryInstructorIdByEmail(String email);

}
