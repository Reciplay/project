package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.courses.service.ZzimQueryService;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.lecture_history.service.PersonalStatService;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CourseQueryServiceImpl implements CourseQueryService{
    private final CourseRepository courseRepository;
    private final CanLearnQueryService canLearnQueryService;
    private final ReviewQueryService reviewQueryService;
    private final CategoryQueryService categoryQueryService;
    private final SubFileMetadataQueryService subFileMetadataQueryService;
    private final ZzimQueryService zzimQueryService;
    private final CourseHistoryQueryService courseHistoryQueryService;
    private final S3Service s3Service;
    private final InstructorQueryService instructorQueryService;
    private final UserQueryService userQueryService;
    private final PersonalStatService personalStatService;

    @Override
    public Course queryCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
    }

    @Override
    public List<CourseDetail> queryCourseDetailsByInstructorId(Long instructorId, String courseStatus) {
        List<Course> courses;
        log.debug("강좌 상태에 따른 course 리스트 조회");
        switch (courseStatus){
            case "soon": courses = courseRepository.findSoonCourseByInstructorId(instructorId); break;
            case "ongoing": courses = courseRepository.findOngoingCourseByInstructorId(instructorId); break;
            case "end": courses = courseRepository.findEndedCourseByInstructorId(instructorId); break;
            default: throw new IllegalArgumentException("잘못된 courseStatus 값입니다. (soon / ongoing / end 중 하나여야 함)");
        }
//        courses = courses.stream().filter(Course::getIsApproved).toList();

        List<CourseDetail> courseDetails = new ArrayList<>();
        for(Course c : courses){
            log.debug("courses를 courseDetails에 삽입");
            courseDetails.add(this.collectCourseDetailWithCommonFields(c));
        }
        return courseDetails;
    }

    @Override
    public CourseDetail queryCourseDetailByCourseId(Long courseId, Long userId) {
        log.debug("강좌 조회");
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
        log.debug("courseDetail에 course 속성 삽입");
        CourseDetail courseDetail = this.collectCourseDetailWithCommonFields(course);
        log.debug("해당 강좌와 사용자 사이의 속성 삽입");
        if(userId != null) {
            courseDetail.setIsZzimed(zzimQueryService.isZzimed(courseId, userId));
            courseDetail.setIsEnrolled(courseHistoryQueryService.enrolled(courseId, userId));
            courseDetail.setIsReviwed(reviewQueryService.isReviewed(courseId, userId));
        } else {
            courseDetail.setIsZzimed(false);
            courseDetail.setIsEnrolled(false);
            courseDetail.setIsReviwed(false);
        }
        log.debug("courseDetail에 추가 데이터 삽입");
        Instructor instructor = instructorQueryService.queryInstructorById(course.getInstructorId());
        User user = userQueryService.queryUserById(instructor.getUserId());
        courseDetail.setInstructorEmail(user.getEmail());
        courseDetail.setInstructorName(user.getName());
        courseDetail.setInstructorNickname(user.getNickname());

        return courseDetail;
    }

    public Boolean isClosedCourse(Long courseId) {
        Course course = this.queryCourseById(courseId);
        log.debug("종료된 강좌인지 여부 반환");
        return (LocalDate.now().isBefore(course.getCourseStartDate()) || LocalDate.now().isAfter(course.getCourseEndDate())) || !course.getIsApproved();
    }

    @Override
    public Boolean isInstructorOf(Long userId, Long courseId) {
        Instructor instructor = instructorQueryService.queryInstructorByUserId(userId);
        log.debug("해당 강사인지 여부 반환");
        return this.queryCourseById(courseId).getInstructorId().equals(
                instructor.getId()
        );

    }

    @Override
    public Boolean isStartedCourse(Long courseId) {
        log.debug("시작한 강좌인지 여부 반환");
        return queryCourseById(courseId).getCourseStartDate().isBefore(LocalDate.now());
    }

    @Override
    public Boolean isInEnrollmentTerm(Long courseId) {
        Course course = queryCourseById(courseId);
        log.debug("course 찾기 성공");
        return course.getEnrollmentStartDate().isBefore(LocalDateTime.now())
                && course.getEnrollmentEndDate().isAfter(LocalDateTime.now());
    }

    @Override
    public Boolean isFullyEnrolledCourse(Long courseId) {
        Course course = queryCourseById(courseId);
        log.debug("course 찾기 성공");
        return course.getMaxEnrollments() <= (courseHistoryQueryService.countEnrollmentsOf(courseId).intValue());
    }


    @Override
    public CourseDetail collectCourseDetailWithCommonFields(Course course) {
        Long courseId = course.getId();
        CourseDetail courseDetail = new CourseDetail(course);
        log.debug("이런걸 배울 수 있어요 리스트 조회");
        List<String> canLearns = canLearnQueryService.queryContentsByCourseId(courseId);
        log.debug("총 리뷰 수 조회");
        Integer reviewCount = reviewQueryService.countReviewsByCourseId(courseId);
        log.debug("평균 별점 조회");
        Double avgStars = reviewQueryService.avgStarsByCourseId(courseId);
        log.debug("카테고리 이름 조회");
        String category = categoryQueryService.queryNameByCourseId(courseId);

        log.debug("썸네일 인스턴스 선언");
        List<FileMetadata> thumbnails = List.of();
        List<ResponseFileInfo> thumbnailFileInfos = new ArrayList<>();

        log.debug("강좌커버 인스턴스 선언");
        FileMetadata courseCover = null;
        ResponseFileInfo courseCoverFileInfo = null;

        log.debug("썸네일 조회");
        try{
            thumbnails = subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAIL");
            for(FileMetadata data : thumbnails){
            thumbnailFileInfos.add(s3Service.getResponseFileInfo(data));
            }
        }catch(RuntimeException e){
            log.debug("썸네일이 null이기 떄문에 조회할 수 없음. : {}", e.getMessage());
        }
        log.debug("강좌 커버 조회");
        try{
            courseCover = subFileMetadataQueryService.queryMetadataByCondition(courseId, "COURSE_COVER");
            courseCoverFileInfo = s3Service.getResponseFileInfo(courseCover);
        }catch(RuntimeException e){
            log.debug("강좌 커버이미지가 null이기 떄문에 조회할 수 없음. : {}", e.getMessage());
        }
        courseDetail.setCanLearns(canLearns);
        courseDetail.setReviewCount(reviewCount);
        courseDetail.setAverageReviewScore(avgStars);
        courseDetail.setCategory(category);
        courseDetail.setThumbnailFileInfos(thumbnailFileInfos);
        courseDetail.setCourseCoverFileInfo(courseCoverFileInfo);

        return courseDetail;
    }

    @Override
    public List<User> queryCourseUsers(Long courseId) {
        log.debug("해당 강좌 수강생들 조회");
        return courseHistoryQueryService.queryCourseHistories(courseId).stream().map(
                c -> userQueryService.queryUserById(c.getUserId())
        ).toList();
    }

    @Override
    public int calcLevelAmount(Long courseId, String email) {
        log.debug("강좌 진행도 계산");
        double progress = personalStatService.calcCourseProgress(courseId, email);
        Course course = this.queryCourseById(courseId);
        return (int)((course.getLevel() * progress) * 0.1);
    }
}
