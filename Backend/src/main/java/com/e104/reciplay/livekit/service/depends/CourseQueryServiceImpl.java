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

    @Override
    public Course queryCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
    }

    @Override
    public List<CourseDetail> queryCourseDetailsByInstructorId(Long instructorId, String courseStatus) {
        List<Course> courses;
        switch (courseStatus){
            case "soon": courses = courseRepository.findSoonCourseByInstructorId(instructorId); break;
            case "ongoing": courses = courseRepository.findOngoingCourseByInstructorId(instructorId); break;
            case "end": courses = courseRepository.findEndedCourseByInstructorId(instructorId); break;
            default: throw new IllegalArgumentException("잘못된 courseStatus 값입니다. (soon / ongoing / end 중 하나여야 함)");
        }
        List<CourseDetail> courseDetails = new ArrayList<>();
        for(Course c : courses){
            courseDetails.add(this.collectCourseDetailWithCommonFields(c));
        }
        return courseDetails;
    }

    @Override
    public CourseDetail queryCourseDetailByCourseId(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
        CourseDetail courseDetail = this.collectCourseDetailWithCommonFields(course);
        Boolean isZzimed = zzimQueryService.isZzimed(courseId, userId);
        Boolean isEnrolled = courseHistoryQueryService.enrolled(courseId, userId);
        Boolean isReviewed = reviewQueryService.isReviewed(courseId, userId);

        courseDetail.setIsZzimed(isZzimed);
        courseDetail.setIsEnrolled(isEnrolled);
        courseDetail.setIsReviwed(isReviewed);

        Instructor instructor = instructorQueryService.queryInstructorById(course.getInstructorId());
        User user = userQueryService.queryUserById(instructor.getUserId());
        courseDetail.setInstructorEmail(user.getEmail());
        courseDetail.setInstructorName(user.getName());
        courseDetail.setInstructorNickname(user.getNickname());


        return courseDetail;
    }

    public Boolean isClosedCourse(Long courseId) {
        Course course = this.queryCourseById(courseId);
        return (LocalDate.now().isBefore(course.getCourseStartDate()) || LocalDate.now().isAfter(course.getCourseEndDate())) || !course.getIsApproved();
    }

    @Override
    public Boolean isInstructorOf(Long userId, Long courseId) {
        Instructor instructor = instructorQueryService.queryInstructorByUserId(userId);
        return this.queryCourseById(courseId).getInstructorId().equals(
                instructor.getId()
        );

    }

    @Override
    public Boolean isStartedCourse(Long courseId) {
        return queryCourseById(courseId).getCourseStartDate().isBefore(LocalDate.now());
    }

    @Override
    public Boolean isInEnrollmentTerm(Long courseId) {
        Course course = queryCourseById(courseId);
        return course.getEnrollmentStartDate().isBefore(LocalDateTime.now())
                && course.getEnrollmentEndDate().isAfter(LocalDateTime.now());
    }

    @Override
    public Boolean isFullyEnrolledCourse(Long courseId) {
        Course course = queryCourseById(courseId);
        return course.getMaxEnrollments() <= (courseHistoryQueryService.countEnrollmentsOf(courseId).intValue());
    }


    @Override
    public CourseDetail collectCourseDetailWithCommonFields(Course course) {
        Long courseId = course.getId();
        CourseDetail courseDetail = new CourseDetail(course);
        List<String> canLearns = canLearnQueryService.queryContentsByCourseId(courseId);
        Integer reviewCount = reviewQueryService.countReviewsByCourseId(courseId);
        Double avgStars = reviewQueryService.avgStarsByCourseId(courseId);
        String category = categoryQueryService.queryNameByCourseId(courseId);

        //5. 해당 강좌의 섬네일들과 커버이미지 조회
        List<FileMetadata> thumbnails = subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail");
        FileMetadata courseCover = subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover");
        // 해당 강좌의 썸네일과 커버이미지 ResponseFileInfo  조회
        List<ResponseFileInfo> thumbnailFileInfos = new ArrayList<>();
        for(FileMetadata data : thumbnails){
            thumbnailFileInfos.add(s3Service.getResponseFileInfo(data));
        }
        ResponseFileInfo courseCoverFileInfo = s3Service.getResponseFileInfo(courseCover);

        courseDetail.setCanLearns(canLearns);
        courseDetail.setReviewCount(reviewCount);
        courseDetail.setAverageReviewScore(avgStars);
        courseDetail.setCategory(category);
        courseDetail.setThumbnailFileInfos(thumbnailFileInfos);
        courseDetail.setCourseCoverFileInfo(courseCoverFileInfo);

        return courseDetail;
    }
}
