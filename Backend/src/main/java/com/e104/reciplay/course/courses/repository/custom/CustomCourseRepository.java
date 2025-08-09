package com.e104.reciplay.course.courses.repository.custom;

import com.e104.reciplay.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomCourseRepository {
    List<Course> findSoonCourseByInstructorId(Long instructorId);

    List<Course> findOngoingCourseByInstructorId(Long instructorId);

    List<Course> findEndedCourseByInstructorId(Long instructorId);

    Page<Course> findSpecialCoursesPage(Pageable pageable);
    Page<Course> findSoonCoursesPage(Pageable pageable);
    Page<Course> findsearchCoursesPage(String content, Boolean IsEnrolled,Long userId, Pageable pageable);
    Page<Course> findInstructorCoursesPage(Long instructorId,Pageable pageable);
    Page<Course> findEnrolledCoursesPage(Long userId,Pageable pageable);
    Page<Course> findZzimCoursesPage(Long userId,Pageable pageable);
    Page<Course> findCompletedCoursesPage(Long userId,Pageable pageable);



}
