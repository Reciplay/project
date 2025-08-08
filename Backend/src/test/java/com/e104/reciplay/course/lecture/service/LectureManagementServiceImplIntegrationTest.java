package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.TodoInfo;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.repository.LectureRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test") // 테스트 프로파일 활성화 (application-test.properties 사용)
class LectureManagementServiceImplIntegrationTest {

    @Autowired
    private LectureManagementServiceImpl lectureManagementService;

    @Autowired
    private LectureRepository lectureRepository;

    @MockitoBean
    private S3Service s3Service;

    @MockitoBean
    private ChapterManagementService chapterManagementService;

    private Lecture testLecture;

    @BeforeEach
    void setUp() {
        // 테스트 데이터 초기화
        testLecture = Lecture.builder()
                .title("초기 강의 제목")
                .summary("초기 강의 요약")
                .sequence(0)
                .materials("초기 준비물")
                .startedAt(LocalDateTime.of(2024, 1, 1, 9, 0))
                .endedAt(LocalDateTime.of(2024, 1, 1, 10, 0))
                .courseId(1L)
                .isSkipped(false)
                .build();
        lectureRepository.save(testLecture); // DB에 저장
    }

    @Test
    @DisplayName("강의 건너뛰기 상태 업데이트에 성공한다")
    void updateSkipStatus_success() {
        // given
        Long lectureId = testLecture.getId();
        boolean newSkipStatus = true;

        // when
        lectureManagementService.updateSkipStatus(lectureId, newSkipStatus);

        // then
        Lecture updatedLecture = lectureRepository.findById(lectureId).orElseThrow();
        assertThat(updatedLecture.getIsSkipped()).isEqualTo(newSkipStatus);
    }

    @Test
    @DisplayName("존재하지 않는 강의의 건너뛰기 상태 업데이트 시 예외가 발생한다")
    void updateSkipStatus_notFound() {
        // given
        Long nonExistentLectureId = 999L;

        // when & then
        assertThrows(LectureNotFoundException.class, () ->
                lectureManagementService.updateSkipStatus(nonExistentLectureId, true));
    }

    @Test
    @DisplayName("강의 정보 업데이트에 성공한다")
    void updateLecture_success() {
        // given
        Long lectureId = testLecture.getId();
        LectureDetail updatedDetail = LectureDetail.builder()
                .lectureId(lectureId)
                .title("업데이트된 강의 제목")
                .summary("업데이트된 강의 요약")
                .materials("업데이트된 준비물")
                .build();

        // when
        lectureManagementService.updateLecture(updatedDetail);

        // then
        Lecture updatedLecture = lectureRepository.findById(lectureId).orElseThrow();
        assertThat(updatedLecture.getTitle()).isEqualTo(updatedDetail.getTitle());
        assertThat(updatedLecture.getSummary()).isEqualTo(updatedDetail.getSummary());
        assertThat(updatedLecture.getMaterials()).isEqualTo(updatedDetail.getMaterials());
    }

    @Test
    @DisplayName("존재하지 않는 강의 정보 업데이트 시 예외가 발생한다")
    void updateLecture_notFound() {
        // given
        Long nonExistentLectureId = 999L;
        LectureDetail updatedDetail = LectureDetail.builder()
                .lectureId(nonExistentLectureId)
                .title("업데이트된 강의 제목")
                .build();

        // when & then
        assertThrows(LectureNotFoundException.class, () ->
                lectureManagementService.updateLecture(updatedDetail));
    }

    @Test
    @DisplayName("강의 등록에 성공하고 관련 서비스가 호출된다")
    void registerLectures_success() throws IOException {
        // given
        Long courseId = 2L;
        LocalDateTime now = LocalDateTime.now();

        List<TodoInfo> todoList = new ArrayList<>();
        todoList.add(new TodoInfo(0, "양파 썰기", TodoType.NORMAL, 0));

        List<ChapterItem> chapterList = new ArrayList<>();
        chapterList.add(new ChapterItem(0, "재료 준비", todoList));

        LectureRequest lectureRequest1 = LectureRequest.builder()
                .title("새 강의 1")
                .summary("새 강의 요약 1")
                .sequence(0)
                .materials("재료 1")
                .startedAt(now)
                .endedAt(now.plusHours(1))
                .chapterList(chapterList)
                .build();

        LectureRequest lectureRequest2 = LectureRequest.builder()
                .title("새 강의 2")
                .summary("새 강의 요약 2")
                .sequence(1)
                .materials("재료 2")
                .startedAt(now.plusHours(1))
                .endedAt(now.plusHours(2))
                .chapterList(chapterList)
                .build();

        MockMultipartFile mockFile1 = new MockMultipartFile("material/0", "file1.pdf", "application/pdf", "data1".getBytes());
        MockMultipartFile mockFile2 = new MockMultipartFile("material/1", "file2.pdf", "application/pdf", "data2".getBytes());

        List<LectureRegisterRequest> requests = new ArrayList<>();
        requests.add(new LectureRegisterRequest(lectureRequest1, mockFile1));
        requests.add(new LectureRegisterRequest(lectureRequest2, mockFile2));

        // Mocking S3Service and ChapterManagementService behavior
        doNothing().when(s3Service).uploadFile(any(MultipartFile.class), any(FileCategory.class), any(RelatedType.class), anyLong(), anyInt());
        doNothing().when(chapterManagementService).registChaptersWithTodos(any(), any());

        // when
        lectureManagementService.registerLectures(requests, courseId);

        // then
        // 강의가 DB에 저장되었는지 확인
        List<Lecture> savedLectures = lectureRepository.findByCourseId(courseId);
        assertThat(savedLectures).hasSize(2);
        assertThat(savedLectures.get(0).getTitle()).isEqualTo("새 강의 1");
        assertThat(savedLectures.get(1).getTitle()).isEqualTo("새 강의 2");

        // S3Service.uploadFile이 각 강의 자료에 대해 호출되었는지 확인
        verify(s3Service, times(2)).uploadFile(any(MultipartFile.class), any(FileCategory.class), any(RelatedType.class), anyLong(), anyInt());

        // ChapterManagementService.registChaptersWithTodos가 호출되었는지 확인
        verify(chapterManagementService, times(1)).registChaptersWithTodos(any(), any());
    }
}
