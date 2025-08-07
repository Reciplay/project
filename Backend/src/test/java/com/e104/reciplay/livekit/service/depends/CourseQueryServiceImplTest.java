package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class CourseQueryServiceImplTest {

    @Mock
    private CourseRepository courseRepository;
    @Mock
    private CanLearnQueryService canLearnQueryService;
    @Mock
    private ReviewQueryService reviewQueryService;
    @Mock
    private CategoryQueryService categoryQueryService;
    @Mock
    private SubFileMetadataQueryService subFileMetadataQueryService;
    @Mock
    private S3Service s3Service;

    @InjectMocks
    private CourseQueryServiceImpl courseQueryService;

    @Test
    void test_queryCourseDetailsByInstructorId_성공() {
        // given
        Long instructorId = 1L;
        Long courseId = 10L;
        Course course = Course.builder()
                .id(courseId)
                .instructorId(instructorId)
                .title("테스트 강좌")
                .summary("요약")
                .description("설명")
                .level(10)
                .maxEnrollments(100)
                .enrollmentStartDate(LocalDateTime.now())
                .enrollmentEndDate(LocalDateTime.now().plusDays(10))
                .courseStartDate(LocalDate.now())
                .courseEndDate(LocalDate.now().plusDays(30))
                .announcement("공지")
                .isLive(false)
                .isApproved(true)
                .isDeleted(false)
                .currentEnrollments(0)
                .registeredAt(LocalDateTime.now())
                .build();

        when(courseRepository.findAllByInstructorId(instructorId.longValue())).thenReturn(List.of(course));
        when(canLearnQueryService.queryContentsByCourseId(courseId)).thenReturn(List.of("자바", "스프링"));
        when(reviewQueryService.countReviewsByCourseId(courseId)).thenReturn(3);
        when(reviewQueryService.avgStarsByCourseId(courseId)).thenReturn(4.3);
        when(categoryQueryService.queryNameByCourseId(courseId)).thenReturn("백엔드");

        FileMetadata file1 = FileMetadata.builder().relatedId(courseId).sequence(1).build();
        FileMetadata cover = FileMetadata.builder().relatedId(courseId).sequence(99).build();

        when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail")).thenReturn(List.of(file1));
        when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover")).thenReturn(cover);

        when(s3Service.getResponseFileInfo(Mockito.any())).thenReturn(new ResponseFileInfo());

        // when
        List<CourseDetail> courseDetails = courseQueryService.queryCourseDetailsByInstructorId(instructorId);

        // then
        assertThat(courseDetails).hasSize(1);
        CourseDetail detail = courseDetails.get(0);
        assertThat(detail.getTitle()).isEqualTo("테스트 강좌");
        assertThat(detail.getCanLearns()).contains("자바", "스프링");
        assertThat(detail.getReviewCount()).isEqualTo(3);
        assertThat(detail.getAverageReviewScore()).isEqualTo(4.3);
        assertThat(detail.getCategory()).isEqualTo("백엔드");
        assertThat(detail.getThumbnailFileInfos()).hasSize(1);
        assertThat(detail.getCourseCoverFileInfo()).isNotNull();
    }
}
