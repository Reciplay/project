package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.service.CanLearnManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.lecture.dto.response.response.CourseTerm;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseManagementServiceImplTest {

    @Mock private CourseRepository courseRepository;
    @Mock private S3Service s3Service;
    @Mock private CanLearnManagementService canLearnManagementService;
    @Mock private CourseQueryService courseQueryService;
    @Mock private SubFileMetadataQueryService subFileMetadataQueryService;
    @Mock private SubFileMetadataManagementService subFileMetadataManagementService;

    @InjectMocks
    private CourseManagementServiceImpl service;

    private MultipartFile cover;
    private List<MultipartFile> thumbnails;

    @BeforeEach
    void setUp() {
        cover = new MockMultipartFile("courseCoverImage", "cover.png", "image/png", "cover".getBytes());
        thumbnails = List.of(
                new MockMultipartFile("thumbnailImages", "thumb1.png", "image/png", "t1".getBytes()),
                new MockMultipartFile("thumbnailImages", "thumb2.png", "image/png", "t2".getBytes())
        );
    }

    private RequestCourseInfo buildRequest(Long courseId) {
        return RequestCourseInfo.builder()
                .courseId(courseId)
                .title("제목")
                .enrollmentStartDate(LocalDateTime.now().minusDays(1))
                .enrollmentEndDate(LocalDateTime.now().plusDays(7))
                .categoryId(10L)
                .summary("요약")
                .maxEnrollments(100)
                .description("설명")
                .level(2)
                .announcement("공지")
                .canLearns(List.of("칼질", "불조절"))
                .build();
    }

    private Course newCourseWithId(Long id) {
        Course c = new Course(buildRequest(null));
        c.setId(id);
        return c;
    }

    @Nested
    class ActivateLiveState {

        @Test
        @DisplayName("강좌 활성화 성공: isLive=true 세팅")
        void activateLiveState_ok() {
            Course course = newCourseWithId(1L);
            course.setIsLive(false);
            when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

            service.activateLiveState(1L);

            assertTrue(course.getIsLive(), "isLive 가 true로 설정되어야 함");
            verify(courseRepository, never()).save(any());
        }

        @Test
        @DisplayName("강좌 없음: IllegalArgumentException")
        void activateLiveState_notFound() {
            when(courseRepository.findById(999L)).thenReturn(Optional.empty());
            assertThrows(IllegalArgumentException.class, () -> service.activateLiveState(999L));
        }
    }

    @Nested
    class CreateCourseByInstructorId {

        @Test
        @DisplayName("강좌 생성: save 후 S3 업로드 & CanLearn 생성 호출")
        void create_ok() throws Exception {
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> {
                Course c = inv.getArgument(0);
                c.setId(99L);
                return c;
            });

            RequestCourseInfo req = buildRequest(null);
            Long instructorId = 777L;

            service.createCourseByInstructorId(instructorId, req, thumbnails, cover);

            verify(courseRepository, times(1)).save(any(Course.class));
            verify(s3Service).uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(99L), eq(1));
            verify(s3Service).uploadFile(eq(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(99L), eq(1));
            verify(s3Service).uploadFile(eq(thumbnails.get(1)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(99L), eq(2));
            verify(canLearnManagementService).createCanLearnsWithCourseId(eq(99L), eq(req.getCanLearns()));
        }

        @Test
        @DisplayName("S3 업로드 IOException 발생해도 예외 전파 없이 로깅 후 계속 진행")
        void create_uploadIOException() throws Exception {
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> {
                Course c = inv.getArgument(0);
                c.setId(101L);
                return c;
            });
            doThrow(new IOException("boom")).when(s3Service)
                    .uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(101L), eq(1));

            RequestCourseInfo req = buildRequest(null);

            assertDoesNotThrow(() -> service.createCourseByInstructorId(1L, req, thumbnails, cover));
            verify(canLearnManagementService).createCanLearnsWithCourseId(eq(101L), eq(req.getCanLearns()));
        }
    }

    @Nested
    class UpdateCourseByCourseId {

        @Test
        @DisplayName("강좌 수정: 기존 CanLearn/이미지 삭제 후 새 이미지 업로드 & CanLearn 재생성")
        void update_ok() throws Exception {
            Long courseId = 123L;
            RequestCourseInfo req = buildRequest(courseId);

            Course existing = newCourseWithId(courseId);
            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            FileMetadata oldThumb1 = FileMetadata.builder().id(1L).relatedId(courseId).relatedType(RelatedType.THUMBNAIL).sequence(1).build();
            FileMetadata oldThumb2 = FileMetadata.builder().id(2L).relatedId(courseId).relatedType(RelatedType.THUMBNAIL).sequence(2).build();
            FileMetadata oldCover  = FileMetadata.builder().id(3L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build();

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail"))
                    .thenReturn(List.of(oldThumb1, oldThumb2));
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover"))
                    .thenReturn(oldCover);

            service.updateCourseByCourseId(req, thumbnails, cover);

            verify(canLearnManagementService).deleteCanLearnsByCourseId(courseId);
            verify(s3Service).deleteFile(oldThumb1);
            verify(s3Service).deleteFile(oldThumb2);
            verify(s3Service).deleteFile(oldCover);
            verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldThumb1);
            verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldThumb2);
            verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldCover);
            verify(s3Service).uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(courseId), eq(1));
            verify(s3Service).uploadFile(eq(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(courseId), eq(1));
        }

        @Test
        @DisplayName("업데이트 시 업로드 IOException 발생해도 예외 전파 없이 진행")
        void update_uploadIOException() throws Exception {
            Long courseId = 321L;
            RequestCourseInfo req = buildRequest(courseId);

            Course existing = newCourseWithId(courseId);
            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail"))
                    .thenReturn(List.of());
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover"))
                    .thenReturn(FileMetadata.builder().id(9L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build());

            doThrow(new IOException("boom")).when(s3Service)
                    .uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(courseId), eq(1));

            assertDoesNotThrow(() -> service.updateCourseByCourseId(req, thumbnails, cover));
            verify(canLearnManagementService).createCanLearnsWithCourseId(courseId, req.getCanLearns());
        }

        @Test
        @DisplayName("삭제 → 업로드 순서 대략 보장 (InOrder 체인 검증)")
        void update_order_hint() throws Exception {
            Long courseId = 555L;
            RequestCourseInfo req = buildRequest(courseId);
            Course existing = newCourseWithId(courseId);
            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            FileMetadata oldCover  = FileMetadata.builder().id(30L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build();
            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail")).thenReturn(List.of());
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover")).thenReturn(oldCover);

            service.updateCourseByCourseId(req, thumbnails, cover);

            InOrder inOrder = inOrder(s3Service, subFileMetadataManagementService);
            inOrder.verify(s3Service).deleteFile(oldCover);
            inOrder.verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldCover);
            inOrder.verify(s3Service).uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(courseId), eq(1));
        }
    }

    @Test
    @DisplayName("uploadImagesWithCourseId: IOException 발생 시 예외 전파 없이 진행")
    void uploadImagesWithCourseId_handlesIOException() throws Exception {
        Long courseId = 42L;
        doThrow(new IOException("cover-fail"))
                .when(s3Service).uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(courseId), eq(1));

        assertDoesNotThrow(() -> service.uploadImagesWithCourseId(courseId, cover, thumbnails));
        verify(s3Service, atLeast(1)).uploadFile(eq(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(courseId), eq(1));
    }

    @Nested
    class SetCourseTerm {

        @Test
        @DisplayName("강좌 기간 설정 성공")
        void setCourseTerm_ok() {
            Long courseId = 10L;
            Course course = newCourseWithId(courseId);
            when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

            CourseTerm term = new CourseTerm(LocalDate.of(2025, 8, 1), LocalDate.of(2025, 8, 31));
            service.setCourseTerm(term, courseId);

            assertEquals(term.getStartDate(), course.getCourseStartDate());
            assertEquals(term.getEndDate(), course.getCourseEndDate());
        }

        @Test
        @DisplayName("강좌 기간 설정 - 존재하지 않는 ID")
        void setCourseTerm_notFound() {
            when(courseRepository.findById(999L)).thenReturn(Optional.empty());
            CourseTerm term = new CourseTerm(LocalDate.now(), LocalDate.now().plusDays(7));

            assertThrows(IllegalArgumentException.class, () -> service.setCourseTerm(term, 999L));
        }
    }
}
