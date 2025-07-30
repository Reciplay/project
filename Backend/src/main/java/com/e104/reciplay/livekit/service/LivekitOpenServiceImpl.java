package com.e104.reciplay.livekit.service;

import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.entity.LiveRoom;
import com.e104.reciplay.livekit.exception.CanNotOpenLiveRoomException;
import com.e104.reciplay.livekit.exception.CanNotParticipateInLiveRoomException;
import com.e104.reciplay.livekit.service.depends.*;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import io.livekit.server.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class LivekitOpenServiceImpl implements LivekitOpenService{
    private final UserQueryService userQueryService;
    private final LectureQueryService lectureQueryService;
    private final InstructorQueryService instructorQueryService;
    private final CourseQueryService courseQueryService;
    private final CourseManagementService courseManagementService;
    private final LiveRoomManagementService liveRoomManagementService;
    private final LiveParticipationManagementService liveParticipationManagementService;
    private final LiveParticipationQueryService liveParticipationQueryService;
    private final CourseHistoryQueryService courseHistoryQueryService;
    private final BlacklistQueryService blacklistQueryService;
    private final LiveRoomQueryService liveRoomQueryService;

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    @Value("${spring.wonjun.test}")
    Boolean isTest;

    public void isOpenable(Long lectureId, Long courseId) {
        Lecture lecture = lectureQueryService.queryLectrueById(lectureId);
        String email = AuthenticationUtil.getSessionUsername();
        Instructor instructor = instructorQueryService.queryInstructorByEmail(email);
        Course course = courseQueryService.queryCourseById(courseId);

        if(lecture.getIsCompleted()) {
            throw new CanNotOpenLiveRoomException("이미 지난 강의입니다.");
        }

        // 강좌 예정 개설 시간이 지났거나, 강좌 예정 개설 시간 1시간 이내에만 개설이 가능하다.
        if(lecture.getStartedAt().isBefore(LocalDateTime.now())
                || lecture.getStartedAt().minusHours(1).isAfter(LocalDateTime.now())) {
            throw new CanNotOpenLiveRoomException("개설 가능 시간이 아닙니다!");
        }

        if(!course.getInstructorId().equals(instructor.getId())) {
            throw new CanNotOpenLiveRoomException("오직 해당 강좌의 강사만 라이브룸을 개설 가능합니다.");
        }
    }

    @Override
    public String createInstructorToken(Long lectureId, Long courseId) {
        if(!isTest) {
            isOpenable(lectureId, courseId); // 불가능할 경우 예외 던져짐.
        }
        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setIdentity(AuthenticationUtil.getSessionUsername()); // participantName 대신 user의 이메일 사용
        token.setName(AuthenticationUtil.getSessionUsername());

        Lecture lecture = isTest ? null : lectureQueryService.queryLectrueById(lectureId);
        String roomName = isTest ? "testRoom" + lectureId : lecture.getTitle() + lectureId.toString();

        token.addGrants(
                new RoomJoin(true),
                new RoomCreate(true),
                new RoomAdmin(true),
                new RoomName(roomName),
                new CanPublish(true),
                new CanPublishData(true),
                new CanSubscribe(true),
                new CanUpdateOwnMetadata(true),
                new RoomRecord(true),
                new CanPublishSources(List.of(
                        "camera", "microphone", "screen_share", "screen_share_audio"
                ))
        );

        // 역할 정보를 메타데이터에 추가
        token.setMetadata("{\"role\": \"instructor\"}");
        if(!isTest) {
            LiveRoom liveRoom = liveRoomManagementService.openLiveRoom(lecture, roomName);
            // 해당 강좌를 라이브 중으로 변경한다.
            courseManagementService.activateLiveState(courseId);
            // 라이브에 참여한다.
            liveParticipationManagementService.participateIn(liveRoom, AuthenticationUtil.getSessionUsername());
        }
        return token.toJwt();
    }

    public void isParticipatable(Long lectureId, Long courseId) {
        // 학생은 이미 어떤 라이브에 참여중이거나, 해당 강좌를 수강신청하지 않았거나, 블랙리스트에 등록되었거나, 라이브중이 아니라면 참여할 수 없다.
        String email = AuthenticationUtil.getSessionUsername();
        if(liveParticipationQueryService.isInAnyLiveRoom(email)) {
            throw new CanNotParticipateInLiveRoomException("이미 참여중인 라이브 방송이 존재합니다.");
        }

        User user = userQueryService.queryUserByEmail(email);
        if(!courseHistoryQueryService.enrolled(user.getId(), courseId)) {
            throw new CanNotParticipateInLiveRoomException("수강신청 하지 않은 강좌의 라이브에 참여할 수 없습니다.");
        }

        if(blacklistQueryService.isInBlacklistOf(user.getId(), courseId)) {
            throw new CanNotParticipateInLiveRoomException("블랙리스트로 처리된 강좌의 라이브에 참여할 수 없습니다.");
        }

        if(!liveRoomQueryService.isLiveLecture(lectureId)) {
            throw new CanNotParticipateInLiveRoomException("해당 강의는 현재 라이브 중이 아닙니다.");
        }
    }

    @Override
    public String createStudentToken(Long lectureId, Long courseId) {
        if(!isTest) {
            isOpenable(lectureId, courseId);
        }
        // 강좌 참여가 가능한 상태이다.
        // 토큰 발급 + 참여 처리.
        String roomName = isTest ? "testRoom" + lectureId : lectureQueryService.queryLectrueById(lectureId).getTitle() + lectureId.toString();
        String email = AuthenticationUtil.getSessionUsername();

        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setIdentity(email); // participantName 대신 userId 사용
        token.setName(email);
        token.addGrants(
                new RoomJoin(true),
                new RoomName(roomName),
                new CanSubscribe(true),
                new CanPublish(true), // 송출 허용 (필요 시)
                new CanPublishData(true),
                new CanUpdateOwnMetadata(true),
                new CanPublishSources(List.of(
                        "camera", "microphone"
                ))
        );

        // 역할 정보를 메타데이터에 추가
        token.setMetadata("{\"role\": \"student\"}");

        if(!isTest) {
            // 참여중으로 등록해야 한다.
            LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
            liveParticipationManagementService.participateIn(liveRoom, email);
        }
        return token.toJwt();
    }


}
