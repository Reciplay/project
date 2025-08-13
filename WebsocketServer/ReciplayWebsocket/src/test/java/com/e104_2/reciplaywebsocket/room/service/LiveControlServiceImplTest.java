package com.e104_2.reciplaywebsocket.room.service;

import com.e104_2.reciplaywebsocket.entity.Course;
import com.e104_2.reciplaywebsocket.entity.Instructor;
import com.e104_2.reciplaywebsocket.entity.Lecture;
import com.e104_2.reciplaywebsocket.entity.LiveRoom;
import com.e104_2.reciplaywebsocket.room.dto.request.LiveControlRequest;
import com.e104_2.reciplaywebsocket.room.redis.ForceQuitRedisService;
import com.e104_2.reciplaywebsocket.room.service.addtional.*;
import com.e104_2.reciplaywebsocket.security.domain.User;
import io.livekit.server.RoomServiceClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import retrofit2.Call;
import retrofit2.Response;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("LiveControlService 단위 테스트")
class LiveControlServiceImplTest {

    // @InjectMocks: @Mock 또는 @Spy로 생성된 목 객체를 자동으로 주입합니다.
    @InjectMocks
    private LiveControlServiceImpl liveControlService;

    // @Mock: 의존성을 가진 객체들을 가짜(Mock) 객체로 만듭니다.
    @Mock private LiveRoomQueryService liveRoomQueryService;
    @Mock private LiveParticipationQueryService liveParticipationQueryService;
    @Mock private LiveParticipationManagementService liveParticipationManagementService;
    @Mock private LectureQueryService lectureQueryService;
    @Mock private RoomServiceClient roomServiceClient;
    @Mock private CourseQueryService courseQueryService;
    @Mock private InstructorQueryService instructorQueryService;
    @Mock private UserQueryService userQueryService;
    @Mock private ForceQuitRedisService forceQuitRedisService;

    // Livekit API 호출을 모킹하기 위한 객체
    @Mock private Call<Void> mockVoidCall;

    @BeforeEach
    void setUp() {
        // @Value로 주입되는 필드 값을 테스트용으로 설정합니다.
        ReflectionTestUtils.setField(liveControlService, "test", false);
        ReflectionTestUtils.setField(liveControlService, "adminKey", "test-admin-key");
    }

    @Test
    @DisplayName("[verifyPrivilege] 성공: 요청자가 해당 강의의 강사일 경우 예외가 발생하지 않는다")
    void verifyPrivilege_Success() {
        // given: 준비
        Long lectureId = 1L;
        String targetEmail = "student@example.com";
        String requesterEmail = "instructor@example.com";

        Lecture mockLecture = Lecture.builder().courseId(10L).build();
        Course mockCourse = Course.builder().instructorId(100L).build();
        Instructor mockInstructor = Instructor.builder().id(100L).build(); // Course의 instructorId와 동일

        when(lectureQueryService.queryLectureById(lectureId)).thenReturn(mockLecture);
        when(courseQueryService.queryCourseById(mockLecture.getCourseId())).thenReturn(mockCourse);
        when(instructorQueryService.queryInstructorByEmail(requesterEmail)).thenReturn(mockInstructor);

        // when & then: 실행 및 검증
        assertDoesNotThrow(() -> liveControlService.verifyPrivilege(lectureId, targetEmail, requesterEmail, "권한 없음"));
    }

    @Test
    @DisplayName("[verifyPrivilege] 실패: 요청자가 강사가 아닐 경우 예외가 발생한다")
    void verifyPrivilege_Fail_NotAnInstructor() {
        // given
        Long lectureId = 1L;
        String targetEmail = "student@example.com";
        String requesterEmail = "not-instructor@example.com";

        Lecture mockLecture = Lecture.builder().courseId(10L).build();
        Course mockCourse = Course.builder().instructorId(100L).build();
        Instructor mockInstructor = Instructor.builder().id(200L).build(); // Course의 instructorId와 다름

        when(lectureQueryService.queryLectureById(lectureId)).thenReturn(mockLecture);
        when(courseQueryService.queryCourseById(mockLecture.getCourseId())).thenReturn(mockCourse);
        when(instructorQueryService.queryInstructorByEmail(requesterEmail)).thenReturn(mockInstructor);

        // when & then
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> liveControlService.verifyPrivilege(lectureId, targetEmail, requesterEmail, "권한이 없습니다."));

        assertEquals("권한이 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("[checkParticipationPrivilege] 실패: 강제 퇴장 목록에 있을 경우 false를 반환하고 퇴장시킨다")
    void checkParticipationPrivilege_Fail_OnForceQuitList() throws IOException {
        // given
        String userEmail = "banned-user@example.com";
        LiveControlRequest request = new LiveControlRequest("room-123", userEmail, 1L);

        when(forceQuitRedisService.isOnQuitList(userEmail, request.getRoomId())).thenReturn(true);
        // removeParticipant 내부의 LiveKit API 호출 모킹
        when(roomServiceClient.removeParticipant(anyString(), anyString())).thenReturn(mockVoidCall);
        when(mockVoidCall.execute()).thenReturn(Response.success(null));

        // when
        boolean result = liveControlService.checkParticipationPrivilege(userEmail, request);

        // then
        assertFalse(result);
        verify(roomServiceClient).removeParticipant(request.getRoomId(), request.getTargetEmail()); // 강제 퇴장 API 호출 검증
    }

    @Test
    @DisplayName("[checkParticipationPrivilege] 성공: 정상적인 참여자일 경우 true를 반환한다")
    void checkParticipationPrivilege_Success() {
        // given
        String userEmail = "student@example.com";
        LiveControlRequest request = new LiveControlRequest("room-123", userEmail, 1L);
        LiveRoom mockLiveRoom = LiveRoom.builder().id(99L).build();

        when(forceQuitRedisService.isOnQuitList(userEmail, request.getRoomId())).thenReturn(false);
        when(liveRoomQueryService.queryLiveRoomByLectureId(request.getLectureId())).thenReturn(mockLiveRoom);
        when(liveParticipationQueryService.queryUserParticipatedIn(userEmail, mockLiveRoom.getId())).thenReturn(true);

        // when
        boolean result = liveControlService.checkParticipationPrivilege(userEmail, request);

        // then
        assertTrue(result);
    }

    @Test
    @DisplayName("[removeParticipant] 성공: 참가자를 성공적으로 강제 퇴장시킨다")
    void removeParticipant_Success() throws IOException {
        // given
        String requesterEmail = "instructor@example.com";
        LiveControlRequest request = new LiveControlRequest("room-123", "student@example.com", 1L);

        // liveControlService의 verifyRemovePrivilege 메서드를 모킹 처리
        // 실제 메서드를 호출하지 않고 통과시키기 위함 (이미 verifyPrivilege 테스트에서 검증함)
        when(roomServiceClient.removeParticipant(request.getRoomId(), request.getTargetEmail())).thenReturn(mockVoidCall);
        when(mockVoidCall.execute()).thenReturn(Response.success(null));

        // when
        liveControlService.removeParticipant(request, "test-admin-key");

        // then
        verify(forceQuitRedisService).addUserInForceQuit(request.getTargetEmail(), request.getRoomId());
        verify(roomServiceClient).removeParticipant(request.getRoomId(), request.getTargetEmail());
    }

    @Test
    @DisplayName("[getLiveInstructorIdentity] 성공: 강의 ID로 강사의 이메일을 정확히 조회한다")
    void getLiveInstructorIdentity_Success() {
        // given
        Long lectureId = 1L;
        Long courseId = 10L;
        Long instructorId = 100L;
        Long mockUserId = 1002L;
        String instructorEmail = "instructor@example.com";

        Lecture mockLecture = Lecture.builder().courseId(courseId).build();
        Course mockCourse = Course.builder().instructorId(instructorId).build();
        User mockUser = User.builder().email(instructorEmail).build();

        when(lectureQueryService.queryLectureById(lectureId)).thenReturn(mockLecture);
        when(courseQueryService.queryCourseById(courseId)).thenReturn(mockCourse);
        when(instructorQueryService.queryInstructorById(instructorId)).thenReturn(Instructor.builder().id(instructorId).userId(mockUserId).build());
        when(userQueryService.queryUserById(mockUserId)).thenReturn(mockUser);

        // when
        String result = liveControlService.getLiveInstructorIdentity(lectureId);

        // then
        assertEquals(instructorEmail, result);
    }
}
