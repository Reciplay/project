package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;

public interface InstructorQueryService {
    Instructor queryInstructorByEmail(String email);

    Long queryInstructorIdByEmail(String email);

    String queryNameByInstructorId(Long instructorId);

    Instructor queryInstructorById(Long instructorId);

    InstructorProfile queryInstructorProfile(Long instructorId, Long userId);

    InstructorStat queryInstructorStatistic(Long instructorId);

}
