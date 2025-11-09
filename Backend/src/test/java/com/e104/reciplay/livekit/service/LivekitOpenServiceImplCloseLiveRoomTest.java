package com.e104.reciplay.livekit.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.livekit.dto.request.CloseLiveRequest;
import com.e104.reciplay.livekit.redis.RoomRedisService;
import com.e104.reciplay.repository.*;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.junit.jupiter.api.Disabled;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("LivekitOpenServiceImpl closeLiveRoom 통합 테스트")
@Transactional // 각 테스트 메서드가 트랜잭션 내에서 실행되고, 종료 후 롤백되도록 설정
public class LivekitOpenServiceImplCloseLiveRoomTest {

    @Autowired
    private LivekitOpenServiceImpl livekitOpenService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private LectureRepository lectureRepository;
    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private LiveRoomRepository liveRoomRepository;
    @Autowired
    private LiveParticipationRepository liveParticipationRepository;
    @Autowired
    private LectureHistoryRepository lectureHistoryRepository;

    @Autowired // RoomRedisService는 외부 의존성이므로 Mock 처리
    private RoomRedisService roomRedisService;

    private User instructorUser;
    private Instructor instructor;
    private Course course;
    private Lecture lecture;
    private LiveRoom liveRoom;
    private CloseLiveRequest closeLiveRequest;

    private MockedStatic<AuthenticationUtil> mockedAuthenticationUtil;

    @BeforeEach
    void setUp() {
        // AuthenticationUtil 모킹
        mockedAuthenticationUtil = mockStatic(AuthenticationUtil.class);

        // 1. 강사 유저 생성 및 저장
        instructorUser = User.builder()
                .email("instructor@test.com")
                .password("password")
                .nickname("강사님")
                .name("강사")
                .isActivated(true) // 필수
                .role("INSTRUCTOR")
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(instructorUser);

        // 2. 강사 엔티티 생성 및 저장
        instructor = Instructor.builder()
                .userId(instructorUser.getId())
                .build();
        instructorRepository.save(instructor);

        // 3. 강좌 생성 및 저장
        course = Course.builder()
                .instructorId(instructor.getId())
                .title("테스트 강좌")
                .isApproved(true) // 필수
                .isLive(true)
                .registeredAt(LocalDateTime.now())
                .build();
        courseRepository.save(course);

        // 4. 강의 생성 및 저장
        lecture = Lecture.builder()
                .courseId(course.getId())
                .title("테스트 강의")
                .sequence(1)
                .startedAt(LocalDateTime.now().minusHours(1))
                .endedAt(LocalDateTime.now().plusHours(1))
                .isCompleted(false)
                .isSkipped(false)
                .build();
        lectureRepository.save(lecture);

        // 5. 라이브룸 생성 및 저장
        liveRoom = LiveRoom.builder()
                .lectureId(lecture.getId())
                .roomname("test-room-" + lecture.getId())
                .build();
        liveRoomRepository.save(liveRoom);

        // CloseLiveRequest 설정
        closeLiveRequest = new CloseLiveRequest(lecture.getId(), liveRoom.getRoomname());

        // SecurityContextHolder에 강사 정보 설정
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(instructorUser.getEmail(), null)
        );
        when(AuthenticationUtil.getSessionUsername()).thenReturn(instructorUser.getEmail());

    }

    @AfterEach
    void tearDown() {
        // MockedStatic 해제
        if (mockedAuthenticationUtil != null) {
            mockedAuthenticationUtil.close();
        }
        // SecurityContextHolder 초기화
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("성공 케이스")
    @Disabled
    class SuccessCases {

        @Test
        @DisplayName("강사가 라이브를 종료하면, 참여자들의 수강 이력이 저장되고 라이브룸이 삭제된다")
        void closeLiveRoom_Success_WithParticipants() {
            // Given
            User student1 = User.builder()
                    .email("student1@test.com")
                    .password("pw")
                    .nickname("학생1")
                    .name("학생일")
                    .isActivated(true)
                    .role("USER")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(student1);

            User student2 = User.builder()
                    .email("student2@test.com")
                    .password("pw")
                    .nickname("학생2")
                    .name("학생이")
                    .isActivated(true)
                    .role("USER")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(student2);

            LiveParticipation participation1 = LiveParticipation.builder()
                    .liveRoomId(liveRoom.getId())
                    .email(student1.getEmail())
                    .build();
            liveParticipationRepository.save(participation1);

            LiveParticipation participation2 = LiveParticipation.builder()
                    .liveRoomId(liveRoom.getId())
                    .email(student2.getEmail())
                    .build();
            liveParticipationRepository.save(participation2);

            // When
            livekitOpenService.closeLiveRoom(closeLiveRequest, instructorUser.getEmail());

            // Then

            // 2. LiveRoom이 삭제되었는지 검증
            assertThat(liveRoomRepository.findById(liveRoom.getId())).isEmpty();

            // 3. LiveParticipation이 삭제되었는지 검증
            assertThat(liveParticipationRepository.findAll()).isEmpty();

            // 4. LectureHistory가 올바르게 저장되었는지 검증
            List<LectureHistory> savedHistories = lectureHistoryRepository.findAll();
            assertThat(savedHistories).hasSize(2);
            assertThat(savedHistories).anyMatch(h -> h.getUserId().equals(student1.getId()) && h.getLectureId().equals(lecture.getId()));
            assertThat(savedHistories).anyMatch(h -> h.getUserId().equals(student2.getId()) && h.getLectureId().equals(lecture.getId()));
        }

        @Test
        @DisplayName("참여자가 없는 라이브를 종료하면, 수강 이력은 저장되지 않고 라이브룸만 삭제된다")
        void closeLiveRoom_Success_NoParticipants() {
            // Given: liveRoom은 setUp에서 생성되었지만, LiveParticipation은 없음

            // When
            livekitOpenService.closeLiveRoom(closeLiveRequest, instructorUser.getEmail());

            // Then

            // 2. LiveRoom이 삭제되었는지 검증
            assertThat(liveRoomRepository.findById(liveRoom.getId())).isEmpty();

            // 3. LiveParticipation이 없는지 검증 (원래 없었으므로)
            assertThat(liveParticipationRepository.findAll()).isEmpty();

            // 4. LectureHistory가 저장되지 않았는지 검증
            List<LectureHistory> savedHistories = lectureHistoryRepository.findAll();
            assertThat(savedHistories).isEmpty();
        }
    }

    @Nested
    @DisplayName("실패 케이스")
    class FailureCases {

        @Test
        @DisplayName("강사가 아닌 사용자가 라이브를 종료하려고 하면 InvalidUserRoleException이 발생한다")
        void closeLiveRoom_Fail_NotAnInstructor() {
            // Given
            User nonInstructorUser = User.builder()
                    .email("student@test.com")
                    .password("pw")
                    .nickname("일반학생")
                    .name("학생")
                    .isActivated(true)
                    .role("USER")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(nonInstructorUser);

            // SecurityContextHolder에 비강사 유저 정보 설정
            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(nonInstructorUser.getEmail(), null)
            );
            when(AuthenticationUtil.getSessionUsername()).thenReturn(nonInstructorUser.getEmail());

            // When & Then
            assertThrows(InvalidUserRoleException.class, () -> {
                livekitOpenService.closeLiveRoom(closeLiveRequest, nonInstructorUser.getEmail());
            });


            // 2. LiveRoom이 삭제되지 않았는지 검증
            assertThat(liveRoomRepository.findById(liveRoom.getId())).isPresent();

            // 3. LiveParticipation이 삭제되지 않았는지 검증 (원래 없었으므로)
            assertThat(liveParticipationRepository.findAll()).isEmpty();

            // 4. LectureHistory가 저장되지 않았는지 검증
            assertThat(lectureHistoryRepository.findAll()).isEmpty();
        }
    }
}