package com.e104.reciplay.course.enrollment.service;

import com.e104.reciplay.course.enrollment.exception.AlreadyEnrolledException;
import com.e104.reciplay.course.enrollment.exception.EnrollmentFailureException;
import com.e104.reciplay.entity.CourseHistory;
import com.e104.reciplay.livekit.service.depends.CourseHistoryQueryService;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentManagementServiceImpl implements EnrollmentManagementService{
    private final CourseHistoryQueryService courseHistoryQueryService;
    private final UserQueryService userQueryService;
    private final CourseQueryService courseQueryService;
    private final CourseHistoryRepository courseHistoryRepository;

    @Override
    @Transactional
    public void enroll(Long courseId, String email) {
        // 이미 수강 신청한 강좌 이거나,
        // 이미 시작한 강좌 이거나,
        // 최대 인원 초과한 경우,
        User user = userQueryService.queryUserByEmail(email);

        if(courseHistoryQueryService.enrolled(user.getId(), courseId)) {
            throw new AlreadyEnrolledException("이미 수강신청 내역이 존재합니다.");
        }
        if(!courseQueryService.isInEnrollmentTerm(courseId)) {
            throw new EnrollmentFailureException("수강신청 기간이 끝난 강좌는 신청할 수 없습니다.");
        }
        if(courseQueryService.isFullyEnrolledCourse(courseId)) {
            throw new EnrollmentFailureException("수강 인원이 초과되었습니다.");
        }

        courseHistoryRepository.save(new CourseHistory(null, user.getId(), courseId, null, true));
    }

    @Override
    public void cancle(Long courseId, String email) {
        User user = userQueryService.queryUserByEmail(email);

        if(!courseHistoryQueryService.enrolled(user.getId(), courseId)) {
            throw new EnrollmentFailureException("수강신청 내역이 없습니다.");
        }
        
        if(!courseQueryService.isInEnrollmentTerm(courseId)) {
            throw new EnrollmentFailureException("수강신청 기간이 끝난 강좌는 취소할 수 없습니다.");
        }

        CourseHistory courseHistory = courseHistoryQueryService.queryCourseHistory(courseId, user.getId());
        courseHistoryRepository.delete(courseHistory);
    }
}
