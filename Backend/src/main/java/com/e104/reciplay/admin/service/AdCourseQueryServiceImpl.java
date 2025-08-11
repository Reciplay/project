package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdCourseDetail;
import com.e104.reciplay.admin.dto.response.AdCourseSummary;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdCourseQueryServiceImpl implements  AdCourseQueryService{
    private final CourseRepository courseRepository;
    private final CategoryQueryService categoryQueryService;
    private final CanLearnQueryService canLearnQueryService;
    private final InstructorQueryService instructorQueryService;
    @Override
    public List<AdCourseSummary> queryAdCourseSummary(Boolean isApprove) {
        if (isApprove == null) {
            throw new IllegalArgumentException("승인 여부 값(isApprove)이 필요합니다.");
        }
        return courseRepository.findAdCourseSummariesByIsApprove(isApprove);
    }

    @Override
    public AdCourseDetail queryCourseDetail(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 강좌입니다."));
        AdCourseDetail adCourseDetail = new AdCourseDetail(course);
        // 따로 가져올 데이터
        List<String> canLearns = canLearnQueryService.queryContentsByCourseId(course.getId()); //이런걸 배울 수 있어요

//        private List<LectureDetail> lectureDetails;

        adCourseDetail.setCategory(categoryQueryService.queryCategoryById(course.getCategoryId()).getName());
        adCourseDetail.setInstructorName(instructorQueryService.queryNameByInstructorId(course.getInstructorId()));
        adCourseDetail.setCanLearns(canLearns);
        return null;
    }
}
