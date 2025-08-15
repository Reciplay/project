package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.admin.service.MessageManagementService;
import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.service.CanLearnManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.lecture.dto.response.CourseTerm;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.profile.service.LevelManagementService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // 👈 Strict stubbing 완화
class CourseManagementServiceImplTest {

    @Mock private CourseRepository courseRepository;
    @Mock private S3Service s3Service;
    @Mock private CanLearnManagementService canLearnManagementService;
    @Mock private CourseQueryService courseQueryService;
    @Mock private SubFileMetadataQueryService subFileMetadataQueryService;
    @Mock private SubFileMetadataManagementService subFileMetadataManagementService;
    @Mock private InstructorQueryService instructorQueryService;
    @Mock private UserQueryService userQueryService;
    @Mock private MessageManagementService messageManagementService;
    @Mock private CategoryQueryService categoryQueryService;
    @Mock private LevelManagementService levelManagementService;

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

    // ---------- 공통 헬퍼: verify(uploadFile) try-catch ----------
    private void verifyUpload(MultipartFile file,
                              FileCategory category,
                              RelatedType relatedType,
                              Long relatedId,
                              Integer sequence) {
        try {
            // 파일은 same(...)으로 동일 인스턴스 매칭
            verify(s3Service).uploadFile(same(file), eq(category), eq(relatedType), eq(relatedId), eq(sequence));
        } catch (IOException e) {
            fail("IOException 발생: " + e.getMessage());
        }
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

            assertTrue(course.getIsLive());
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
        @DisplayName("강좌 생성: save 후 S3 업로드 & CanLearn 생성 호출, courseId 반환")
        void create_ok() {
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> {
                Course c = inv.getArgument(0);
                c.setId(99L);
                return c;
            });

            RequestCourseInfo req = buildRequest(null);
            Long instructorId = 777L;

            Long returnedId = service.createCourseByInstructorId(instructorId, req, thumbnails, cover);

            assertEquals(99L, returnedId);
            verify(courseRepository).save(any(Course.class));
            verifyUpload(cover, FileCategory.IMAGES, RelatedType.COURSE_COVER, 99L, 1);
            verifyUpload(thumbnails.get(0), FileCategory.IMAGES, RelatedType.THUMBNAIL, 99L, 1);
            verifyUpload(thumbnails.get(1), FileCategory.IMAGES, RelatedType.THUMBNAIL, 99L, 2);
            verify(canLearnManagementService).createCanLearnsWithCourseId(eq(99L), eq(req.getCanLearns()));
        }

        @Test
        @DisplayName("생성: 커버 업로드 IOException 발생해도 예외 전파 없이 진행")
        void create_coverUploadIOException() throws Exception {
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> {
                Course c = inv.getArgument(0);
                c.setId(101L);
                return c;
            });

            // lenient + same(cover)
            lenient().doThrow(new IOException("boom")).when(s3Service)
                    .uploadFile(same(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(101L), eq(1));

            RequestCourseInfo req = buildRequest(null);

            Long returnedId = assertDoesNotThrow(() -> service.createCourseByInstructorId(1L, req, thumbnails, cover));
            assertEquals(101L, returnedId);

            // 커버 실패해도 썸네일/CanLearn은 계속
            try {
                verify(s3Service, atLeastOnce()).uploadFile(same(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(101L), eq(1));
            } catch (IOException e) {
                fail(e);
            }
            verify(canLearnManagementService).createCanLearnsWithCourseId(eq(101L), eq(req.getCanLearns()));
        }

        @Test
        @DisplayName("생성: 첫 번째 썸네일 업로드 IOException이어도 두 번째 썸네일/나머지 계속")
        void create_firstThumbnailIOException_continue() throws Exception {
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> {
                Course c = inv.getArgument(0);
                c.setId(202L);
                return c;
            });

            // 첫 썸네일만 실패
            lenient().doThrow(new IOException("thumb1-fail")).when(s3Service)
                    .uploadFile(same(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(202L), eq(1));

            RequestCourseInfo req = buildRequest(null);

            Long returnedId = assertDoesNotThrow(() -> service.createCourseByInstructorId(2L, req, thumbnails, cover));
            assertEquals(202L, returnedId);

            verifyUpload(cover, FileCategory.IMAGES, RelatedType.COURSE_COVER, 202L, 1);
            verifyUpload(thumbnails.get(1), FileCategory.IMAGES, RelatedType.THUMBNAIL, 202L, 2);
            verify(canLearnManagementService).createCanLearnsWithCourseId(eq(202L), eq(req.getCanLearns()));
        }
    }

    @Nested
    class UpdateCourseByCourseId {

        @Test
        @DisplayName("수정: 기존 삭제 후 재업로드 & CanLearn 재생성, courseId 반환")
        void update_ok() {
            Long courseId = 123L;
            RequestCourseInfo req = buildRequest(courseId);

            Course existing = newCourseWithId(courseId);
            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            FileMetadata oldThumb1 = FileMetadata.builder().id(1L).relatedId(courseId).relatedType(RelatedType.THUMBNAIL).sequence(1).build();
            FileMetadata oldThumb2 = FileMetadata.builder().id(2L).relatedId(courseId).relatedType(RelatedType.THUMBNAIL).sequence(2).build();
            FileMetadata oldCover  = FileMetadata.builder().id(3L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build();

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAILS"))
                    .thenReturn(List.of(oldThumb1, oldThumb2));
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "COURSE_COVER"))
                    .thenReturn(oldCover);

            Long returnedId = service.updateCourseByCourseId(req, thumbnails, cover);

            assertEquals(courseId, returnedId);
            verify(canLearnManagementService).deleteCanLearnsByCourseId(courseId);
            verify(s3Service).deleteFile(oldThumb1);
            verify(s3Service).deleteFile(oldThumb2);
            verify(s3Service).deleteFile(oldCover);
            verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldThumb1);
            verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldThumb2);
            verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldCover);
            verifyUpload(cover, FileCategory.IMAGES, RelatedType.COURSE_COVER, courseId, 1);
            verifyUpload(thumbnails.get(0), FileCategory.IMAGES, RelatedType.THUMBNAIL, courseId, 1);
        }

        @Test
        @DisplayName("수정: 커버 업로드 IOException 발생해도 예외 전파 없이 진행")
        void update_coverUploadIOException() throws Exception {
            Long courseId = 321L;
            RequestCourseInfo req = buildRequest(courseId);

            Course existing = newCourseWithId(courseId);
            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAILS"))
                    .thenReturn(List.of());
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "COURSE_COVER"))
                    .thenReturn(FileMetadata.builder().id(9L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build());

            lenient().doThrow(new IOException("boom")).when(s3Service)
                    .uploadFile(same(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(courseId), eq(1));

            Long returnedId = assertDoesNotThrow(() -> service.updateCourseByCourseId(req, thumbnails, cover));
            assertEquals(courseId, returnedId);
            verify(canLearnManagementService).createCanLearnsWithCourseId(courseId, req.getCanLearns());
        }

        @Test
        @DisplayName("수정: 첫 번째 썸네일 업로드 IOException이어도 두 번째/나머지 계속")
        void update_firstThumbnailIOException_continue() throws Exception {
            Long courseId = 654L;
            RequestCourseInfo req = buildRequest(courseId);

            Course existing = newCourseWithId(courseId);
            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAILS"))
                    .thenReturn(List.of()); // 기존 썸네일 없음 가정
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "COURSE_COVER"))
                    .thenReturn(FileMetadata.builder().id(99L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build());

            // 첫 썸네일 업로드 실패
            lenient().doThrow(new IOException("thumb1-fail")).when(s3Service)
                    .uploadFile(same(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(courseId), eq(1));

            Long returnedId = assertDoesNotThrow(() -> service.updateCourseByCourseId(req, thumbnails, cover));
            assertEquals(courseId, returnedId);

            verifyUpload(thumbnails.get(1), FileCategory.IMAGES, RelatedType.THUMBNAIL, courseId, 2);
            verify(canLearnManagementService).createCanLearnsWithCourseId(courseId, req.getCanLearns());
        }

        @Test
        @DisplayName("수정: 썸네일 조회 RuntimeException이어도 계속")
        void update_thumbnailsQueryThrows_butContinues() {
            Long courseId = 777L;
            RequestCourseInfo req = buildRequest(courseId);
            Course existing = newCourseWithId(courseId);

            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAILS"))
                    .thenThrow(new RuntimeException("no-thumbs"));

            FileMetadata oldCover  = FileMetadata.builder().id(30L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build();
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "COURSE_COVER")).thenReturn(oldCover);

            Long returnedId = assertDoesNotThrow(() -> service.updateCourseByCourseId(req, thumbnails, cover));
            assertEquals(courseId, returnedId);

            verify(s3Service, never()).deleteFile(argThat(fm -> fm != null && fm.getRelatedType() == RelatedType.THUMBNAIL));
            verify(s3Service).deleteFile(oldCover);
            verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldCover);
            verifyUpload(cover, FileCategory.IMAGES, RelatedType.COURSE_COVER, courseId, 1);
            verify(canLearnManagementService).createCanLearnsWithCourseId(courseId, req.getCanLearns());
        }

        @Test
        @DisplayName("수정: 커버 조회 RuntimeException이어도 계속")
        void update_coverQueryThrows_butContinues() {
            Long courseId = 778L;
            RequestCourseInfo req = buildRequest(courseId);
            Course existing = newCourseWithId(courseId);

            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAILS"))
                    .thenReturn(List.of());
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "COURSE_COVER"))
                    .thenThrow(new RuntimeException("no-cover"));

            Long returnedId = assertDoesNotThrow(() -> service.updateCourseByCourseId(req, thumbnails, cover));
            assertEquals(courseId, returnedId);

            verify(s3Service, never()).deleteFile(argThat(fm -> fm != null && fm.getRelatedType() == RelatedType.COURSE_COVER));
            verifyUpload(cover, FileCategory.IMAGES, RelatedType.COURSE_COVER, courseId, 1);
            verify(canLearnManagementService).createCanLearnsWithCourseId(courseId, req.getCanLearns());
        }

        @Test
        @DisplayName("삭제 → 업로드 순서(대략) 검증")
        void update_order_hint() {
            Long courseId = 555L;
            RequestCourseInfo req = buildRequest(courseId);
            Course existing = newCourseWithId(courseId);
            when(courseQueryService.queryCourseById(courseId)).thenReturn(existing);
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

            FileMetadata oldCover  = FileMetadata.builder().id(30L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build();

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAILS")).thenReturn(List.of());
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "COURSE_COVER")).thenReturn(oldCover);

            Long returnedId = service.updateCourseByCourseId(req, thumbnails, cover);
            assertEquals(courseId, returnedId);

            InOrder inOrder = inOrder(s3Service, subFileMetadataManagementService);
            inOrder.verify(s3Service).deleteFile(oldCover);
            inOrder.verify(subFileMetadataManagementService).deleteMetadataByEntitiy(oldCover);
            verifyUpload(cover, FileCategory.IMAGES, RelatedType.COURSE_COVER, courseId, 1);
        }
    }

    @Test
    @DisplayName("uploadImagesWithCourseId: 커버 IOException이어도 썸네일 업로드는 계속")
    void uploadImagesWithCourseId_coverIOException_continuesThumbnails() throws Exception {
        Long courseId = 42L;

        lenient().doThrow(new IOException("cover-fail"))
                .when(s3Service).uploadFile(same(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(courseId), eq(1));

        assertDoesNotThrow(() -> service.uploadImagesWithCourseId(courseId, cover, thumbnails));
        verifyUpload(thumbnails.get(0), FileCategory.IMAGES, RelatedType.THUMBNAIL, courseId, 1);
        verifyUpload(thumbnails.get(1), FileCategory.IMAGES, RelatedType.THUMBNAIL, courseId, 2);
    }

    @Test
    @DisplayName("uploadImagesWithCourseId: 첫 번째 썸네일 IOException이어도 두 번째는 계속")
    void uploadImagesWithCourseId_firstThumbnailIOException_continueSecond() throws Exception {
        Long courseId = 43L;

        lenient().doThrow(new IOException("thumb1-fail"))
                .when(s3Service).uploadFile(same(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(courseId), eq(1));

        assertDoesNotThrow(() -> service.uploadImagesWithCourseId(courseId, cover, thumbnails));
        verifyUpload(thumbnails.get(1), FileCategory.IMAGES, RelatedType.THUMBNAIL, courseId, 2);
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

    @Nested
    class CloseCourse {
        private Course course;
        private Instructor instructor;
        private User instructorUser;
        private final Long courseId = 1L;
        private final Long instructorId = 10L;
        private final Long instructorUserId = 100L;
        private final String instructorEmail = "instructor@test.com";

        @BeforeEach
        void setUp() {
            course = new Course();
            course.setId(courseId);
            course.setInstructorId(instructorId);
            course.setCategoryId(5L);
            course.setTitle("테스트 강좌");

            instructor = new Instructor();
            instructor.setId(instructorId);
            instructor.setUserId(instructorUserId);

            instructorUser = User.builder()
                    .id(instructorUserId)
                    .email(instructorEmail)
                    .build();
        }

        @Test
        @DisplayName("강좌 종료 성공: 수강생 레벨업 및 메시지 전송")
        void closeCourse_success() {
            course.setCourseEndDate(LocalDate.now().minusDays(1)); // 종료일 지남
            User student1 = User.builder().id(201L).email("s1@test.com").build();
            User student2 = User.builder().id(202L).email("s2@test.com").build();
            Category category = new Category(5L, "요리");

            when(courseQueryService.queryCourseById(courseId)).thenReturn(course);
            when(instructorQueryService.queryInstructorById(instructorId)).thenReturn(instructor);
            when(userQueryService.queryUserById(instructorUserId)).thenReturn(instructorUser);
            when(courseQueryService.queryCourseUsers(courseId)).thenReturn(List.of(student1, student2));
            when(courseQueryService.calcLevelAmount(eq(courseId), anyString())).thenReturn(10);
            when(categoryQueryService.queryCategoryById(5L)).thenReturn(category);

            assertDoesNotThrow(() -> service.closeCourse(courseId, instructorEmail));

            verify(levelManagementService).increaseLevelOf(5L, student1.getId(), 10);
            verify(levelManagementService).increaseLevelOf(5L, student2.getId(), 10);

            verify(messageManagementService).createMessage(eq(instructorUserId), eq(student1.getId()),
                    argThat(msg -> msg.contains("[" + course.getTitle() + "]")
                            && msg.contains(category.getName())
                            && msg.contains("10")));
            verify(messageManagementService).createMessage(eq(instructorUserId), eq(student2.getId()),
                    argThat(msg -> msg.contains("[" + course.getTitle() + "]")
                            && msg.contains(category.getName())
                            && msg.contains("10")));
        }

        @Test
        @DisplayName("강좌 종료 실패: 강사가 아닌 사용자가 요청")
        void closeCourse_fail_notInstructor() {
            when(courseQueryService.queryCourseById(courseId)).thenReturn(course);
            when(instructorQueryService.queryInstructorById(instructorId)).thenReturn(instructor);
            when(userQueryService.queryUserById(instructorUserId)).thenReturn(instructorUser);

            assertThrows(InvalidUserRoleException.class,
                    () -> service.closeCourse(courseId, "not.instructor@test.com"));
        }

        @Test
        @DisplayName("강좌 종료 실패: 종료일이 지나지 않음")
        void closeCourse_fail_endDateNotPassed() {
            course.setCourseEndDate(LocalDate.now().plusDays(1)); // 종료일 안 지남
            when(courseQueryService.queryCourseById(courseId)).thenReturn(course);
            when(instructorQueryService.queryInstructorById(instructorId)).thenReturn(instructor);
            when(userQueryService.queryUserById(instructorUserId)).thenReturn(instructorUser);

            assertThrows(IllegalArgumentException.class,
                    () -> service.closeCourse(courseId, instructorEmail));
        }

        @Test
        @DisplayName("강좌 종료 성공: 수강생이 없을 경우")
        void closeCourse_success_noStudents() {
            course.setCourseEndDate(LocalDate.now().minusDays(1)); // 종료일 지남
            when(courseQueryService.queryCourseById(courseId)).thenReturn(course);
            when(instructorQueryService.queryInstructorById(instructorId)).thenReturn(instructor);
            when(userQueryService.queryUserById(instructorUserId)).thenReturn(instructorUser);
            when(courseQueryService.queryCourseUsers(courseId)).thenReturn(Collections.emptyList());

            assertDoesNotThrow(() -> service.closeCourse(courseId, instructorEmail));

            verify(levelManagementService, never()).increaseLevelOf(anyLong(), anyLong(), anyInt());
            verify(messageManagementService, never()).createMessage(anyLong(), anyLong(), anyString());
        }
    }
}
