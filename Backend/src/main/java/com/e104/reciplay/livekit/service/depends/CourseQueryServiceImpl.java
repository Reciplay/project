package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CourseQueryServiceImpl implements CourseQueryService{
    private final CourseRepository courseRepository;
    private final CanLearnQueryService canLearnQueryService;
    //private final LectureSummaryQueryService lectureSummaryQueryService;
    private final ReviewQueryService reviewQueryService;
    private final CategoryQueryService categoryQueryService;
    private final SubFileMetadataQueryService subFileMetadataQueryService;
    private final S3Service s3Service;
    @Override
    public Course queryCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
    }

    @Override
    public List<CourseDetail> queryCourseDetailsByInstructorId(Long instructorId) {
        List<Course> courses = courseRepository.findAllByInstructorId(instructorId);
        List<CourseDetail> courseDetails = new ArrayList<>();
        for(Course c : courses){
            courseDetails.add(this.collectCourseDetailWithCommonFields(c));
        }
        return courseDetails;
    }

    @Override
    public Boolean isClosedCourse(Long courseId) {
        Course course = this.queryCourseById(courseId);
        return (LocalDate.now().isBefore(course.getCourseStartDate()) || LocalDate.now().isAfter(course.getCourseEndDate())) && course.getIsApproved();
    }


    private CourseDetail collectCourseDetailWithCommonFields(Course course) {
        Long courseId = course.getId();
        CourseDetail courseDetail = new CourseDetail(course);
        List<String> canLearns = canLearnQueryService.queryContentsByCourseId(courseId);
        //List<LectureSummary> lectureSummaries = lectureSummaryQueryService.queryLectureSummariesByCourseId(courseId);
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


        //courseDetail.setLectureSummaryList(lectureSummaries);
        courseDetail.setCanLearns(canLearns);
        courseDetail.setReviewCount(reviewCount);
        courseDetail.setAverageReviewScore(avgStars);
        courseDetail.setCategory(category);
        courseDetail.setThumbnailFileInfos(thumbnailFileInfos);
        courseDetail.setCourseCoverFileInfo(courseCoverFileInfo);

        return courseDetail;

    }
}
