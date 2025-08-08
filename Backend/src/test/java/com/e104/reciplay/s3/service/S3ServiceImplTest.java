//package com.e104.reciplay.s3.service;
//
//import com.e104.reciplay.entity.FileMetadata;
//import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
//import com.e104.reciplay.s3.enums.FileCategory;
//import com.e104.reciplay.s3.enums.RelatedType;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.mock.web.MockMultipartFile;
//import software.amazon.awssdk.core.sync.RequestBody;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//
//import java.io.IOException;
//import java.lang.reflect.Field;
//import java.time.LocalDateTime;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
//class S3ServiceImplTest {
//
//    @InjectMocks
//    private S3ServiceImpl s3Service;
//
//    @Mock
//    private S3Client s3Client;
//
//    @Mock
//    private FileMetadataManagementService fileMetadataManagementService;
//
//    @Mock
//    private FileMetadataQueryService fileMetadataQueryService;
//
//    @BeforeEach
//    void setUp() throws Exception {
//        s3Service = new S3ServiceImpl(s3Client, fileMetadataManagementService, fileMetadataQueryService);
//        // 수동 설정이므로 @Value 대체
//        setPrivateField(s3Service, "bucket", "test-bucket");
//        setPrivateField(s3Service, "accessKey", "test-access-key");
//        setPrivateField(s3Service, "secretKey", "test-secret-key");
//        setPrivateField(s3Service, "region", "ap-northeast-2");
//        setPrivateField(s3Service, "ttl", 180L);
//    }
//
//    @Test
//    void testUploadFile_success() throws IOException {
//        // given
//        byte[] fileContent = "test file".getBytes();
//        MockMultipartFile multipartFile = new MockMultipartFile(
//                "material", "test.pdf", "application/pdf", fileContent);
//
//        FileMetadata mockSavedMetadata = FileMetadata.builder()
//                .id(123L)
//                .name("test.pdf")
//                .category(FileCategory.MATERIALS)
//                .relatedType(RelatedType.LECTURE)
//                .relatedId(1L)
//                .resourceType("pdf")
//                .uploadedAt(LocalDateTime.now())
//                .sequence(1)
//                .build();
//
//        when(fileMetadataManagementService.writeFile(any())).thenReturn(mockSavedMetadata);
//
//        // when
//        s3Service.uploadFile(multipartFile, FileCategory.MATERIALS, RelatedType.LECTURE, 1L, 1);
//
//        // then
//        verify(s3Client).putObject(any(PutObjectRequest.class), any(RequestBody.class));
//        verify(fileMetadataManagementService).writeFile(any(FileMetadata.class));
//    }
//
//    @Test
//    void testGetResponseFileInfo_success() {
//        // given
//        FileMetadata metadata = FileMetadata.builder()
//                .id(1L)
//                .name("sample.jpg")
//                .category(FileCategory.IMAGES)
//                .relatedType(RelatedType.USER_PROFILE)
//                .relatedId(100L)
//                .resourceType("jpg")
//                .sequence(1)
//                .uploadedAt(LocalDateTime.now())
//                .build();
//
//        when(fileMetadataQueryService.queryByMetadata(FileCategory.IMAGES, RelatedType.USER_PROFILE, 100L, 1))
//                .thenReturn(metadata);
//
//        // when
//        ResponseFileInfo result = s3Service.getResponseFileInfo(
//                FileCategory.IMAGES, RelatedType.USER_PROFILE, 100L, 1
//        );
//
//        // then
//        assertEquals("sample.jpg", result.getName());
//        assertTrue(result.getPresignedUrl().contains("http")); // Presigned URL 형식만 체크
//    }
//
//    @Test
//    void testDeleteFile_success() {
//        // given
//        FileMetadata metadata = FileMetadata.builder()
//                .id(1L)
//                .name("replay.mp4")
//                .category(FileCategory.VIDEOS)
//                .relatedType(RelatedType.REPLAY)
//                .relatedId(100L)
//                .resourceType("mp4")
//                .sequence(1)
//                .build();
//
//        when(fileMetadataQueryService.queryByMetadata(FileCategory.VIDEOS, RelatedType.REPLAY, 100L, 1))
//                .thenReturn(metadata);
//
//        // when
//        s3Service.deleteFile(FileCategory.VIDEOS, RelatedType.REPLAY, 100L, 1);
//
//        // then
//        verify(s3Client).deleteObject(any(DeleteObjectRequest.class));
//        verify(fileMetadataManagementService).deleteFile(metadata);
//    }
//    private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
//        Field field = target.getClass().getDeclaredField(fieldName);
//        field.setAccessible(true);
//        field.set(target, value);
//    }
//}


package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.service.CanLearnManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
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
            // save 호출은 코드상 없음(영속 컨텍스트 가정). 호출 안 됐는지 확인해도 됨.
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
            // save 호출 시 JPA가 id를 채워주는 상황을 Answer로 흉내
            when(courseRepository.save(any(Course.class))).thenAnswer(inv -> {
                Course c = inv.getArgument(0);
                c.setId(99L);
                return c;
            });

            RequestCourseInfo req = buildRequest(null);
            Long instructorId = 777L;

            service.createCourseByInstructorId(instructorId, req, thumbnails, cover);

            // 저장 검증
            verify(courseRepository, times(1)).save(any(Course.class));

            // S3 업로드 검증 (커버)
            verify(s3Service).uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(99L), eq(1));

            // 썸네일 업로드 검증 (시퀀스 1, 2)
            verify(s3Service).uploadFile(eq(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(99L), eq(1));
            verify(s3Service).uploadFile(eq(thumbnails.get(1)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(99L), eq(2));

            // CanLearn 생성 호출 검증
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

            // 커버 업로드 시도는 됐어야 함
            verify(s3Service).uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(101L), eq(1));
            // 썸네일들도 시도
            verify(s3Service, atLeastOnce()).uploadFile(any(MultipartFile.class), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(101L), anyInt());
            // CanLearn 생성은 여전히 호출
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

            // 기존 메타데이터
            FileMetadata oldThumb1 = FileMetadata.builder().id(1L).relatedId(courseId).relatedType(RelatedType.THUMBNAIL).sequence(1).build();
            FileMetadata oldThumb2 = FileMetadata.builder().id(2L).relatedId(courseId).relatedType(RelatedType.THUMBNAIL).sequence(2).build();
            FileMetadata oldCover  = FileMetadata.builder().id(3L).relatedId(courseId).relatedType(RelatedType.COURSE_COVER).sequence(1).build();

            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail"))
                    .thenReturn(List.of(oldThumb1, oldThumb2));
            when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover"))
                    .thenReturn(oldCover);

            // 실행
            service.updateCourseByCourseId(req, thumbnails, cover);

            // 강좌 수정/저장 검증
            verify(courseRepository).save(existing);

            // 기존 CanLearn 삭제
            verify(canLearnManagementService).deleteCanLearnsByCourseId(courseId);

            // 기존 파일 S3 삭제 + 메타데이터 삭제
            verify(s3Service).deleteFile(oldThumb1);
            verify(s3Service).deleteFile(oldThumb2);
            verify(s3Service).deleteFile(oldCover);

            verify(subFileMetadataQueryService).deleteMetadataByEntitiy(oldThumb1);
            verify(subFileMetadataQueryService).deleteMetadataByEntitiy(oldThumb2);
            verify(subFileMetadataQueryService).deleteMetadataByEntitiy(oldCover);

            // 새 파일 업로드 (커버 + 썸네일들)
            verify(s3Service).uploadFile(eq(cover), eq(FileCategory.IMAGES), eq(RelatedType.COURSE_COVER), eq(courseId), eq(1));
            verify(s3Service).uploadFile(eq(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(courseId), eq(1));
            verify(s3Service).uploadFile(eq(thumbnails.get(1)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(courseId), eq(2));

            // CanLearn 재생성
            verify(canLearnManagementService).createCanLearnsWithCourseId(courseId, req.getCanLearns());
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

            // 실패했어도 나머지 흐름은 진행
            verify(canLearnManagementService).createCanLearnsWithCourseId(courseId, req.getCanLearns());
        }

        @Test
        @DisplayName("삭제 → 업로드 순서 대략 보장 (중요하면 InOrder로 최소 체인 확인)")
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

            InOrder inOrder = inOrder(subFileMetadataQueryService, s3Service);
            // 커버 메타데이터 삭제 전에 S3 삭제 호출되는지 등 세밀한 순서 검증 필요하면 여기서 체인 추가
            inOrder.verify(s3Service).deleteFile(oldCover);
            inOrder.verify(subFileMetadataQueryService).deleteMetadataByEntitiy(oldCover);
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

        // 커버 실패했어도 썸네일 업로드는 시도한다
        verify(s3Service, atLeast(1)).uploadFile(eq(thumbnails.get(0)), eq(FileCategory.IMAGES), eq(RelatedType.THUMBNAIL), eq(courseId), eq(1));
    }
}
