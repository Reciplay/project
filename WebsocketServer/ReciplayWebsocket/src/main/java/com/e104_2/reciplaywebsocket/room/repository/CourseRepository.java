package com.e104_2.reciplaywebsocket.room.repository;

import com.e104_2.reciplaywebsocket.entity.Course;
import com.e104_2.reciplaywebsocket.room.repository.custom.CustomCourseRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, CustomCourseRepository {
}
