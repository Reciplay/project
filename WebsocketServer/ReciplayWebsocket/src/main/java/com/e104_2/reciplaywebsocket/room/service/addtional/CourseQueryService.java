package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.Course;

public interface CourseQueryService {
    Course queryCourseOfLecture(Long lectureId);
    Course queryCourseById(Long id);
}
