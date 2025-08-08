package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import org.springframework.web.multipart.MultipartFile;
import com.e104.reciplay.course.lecture.dto.response.response.CourseTerm;

import java.util.List;

public interface CourseManagementService {
    void activateLiveState(Long courseId);

    void createCourseByInstructorId(Long instructorId,
                                    RequestCourseInfo courseRegisterInfo,
                                    List<MultipartFile> thumbnailImages,
                                    MultipartFile courseCoverImage);
    void updateCourseByCourseId(RequestCourseInfo requestCourseInfo,
                                List<MultipartFile> thumbnailImages,
                                MultipartFile courseCoverImage);

    void setCourseTerm(CourseTerm term, Long courseId);

}
