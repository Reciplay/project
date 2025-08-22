package com.e104.reciplay.livekit.service;

import com.e104.reciplay.bot.service.ChatBotService;
import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.livekit.dto.request.CloseLiveRequest;
import com.e104.reciplay.livekit.dto.response.LivekitTokenResponse;
import com.e104.reciplay.livekit.exception.CanNotOpenLiveRoomException;
import com.e104.reciplay.livekit.exception.CanNotParticipateInLiveRoomException;
import com.e104.reciplay.livekit.redis.RoomRedisService;
import com.e104.reciplay.livekit.service.depends.*;
import com.e104.reciplay.repository.LectureHistoryRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import io.livekit.server.*;
import jakarta.transaction.Transactional;
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
    private final RoomRedisService roomRedisService;
    private final ChatBotService chatBotService;
    private final LectureHistoryRepository lectureHistoryRepository;

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    @Value("${spring.wonjun.test}")
    Boolean isTest;

    public void isOpenable(Long lectureId, Long courseId) {
        Lecture lecture = lectureQueryService.queryLectureById(lectureId);
        String email = AuthenticationUtil.getSessionUsername();
        Instructor instructor = instructorQueryService.queryInstructorByEmail(email);
        Course course = courseQueryService.queryCourseById(courseId);

        log.debug("이미 끝난 강의인지를 검사합니다.");
        if(lecture.getIsCompleted()) {
            throw new CanNotOpenLiveRoomException("이미 지난 강의입니다.");
        }

        log.debug("강의 시작 3시간 이내인지 검사합니다..");
        // 강좌 예정 개설 시간이 지났거나, 강좌 예정 개설 시간 1시간 이내에만 개설이 가능하다.
        if(lecture.getStartedAt().isBefore(LocalDateTime.now())
                || lecture.getStartedAt().minusHours(3).isAfter(LocalDateTime.now())) {
            throw new CanNotOpenLiveRoomException("개설 가능 시간이 아닙니다!");
        }


        log.debug("강좌의 강사인지 검사합니다.");
        if(!course.getInstructorId().equals(instructor.getId())) {
            throw new CanNotOpenLiveRoomException("오직 해당 강좌의 강사만 라이브룸을 개설 가능합니다.");
        }
    }

    @Override
    public LivekitTokenResponse createInstructorToken(Long lectureId, Long courseId) {
        if(!isTest) {
            isOpenable(lectureId, courseId); // 불가능할 경우 예외 던져짐.
        }
        log.debug("강사 토큰 생성 서비스 호출. 강의 ID = {}, 강좌 ID = {}", lectureId, courseId);

        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setIdentity(AuthenticationUtil.getSessionUsername()); // participantName 대신 user의 이메일 사용
        token.setName(AuthenticationUtil.getSessionUsername());

        String roomName = getRoomIdOf(lectureId, true);
        log.debug("조회된 roomName = {}", roomName);

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
            log.debug("디버그 환경이 아닙니다. 강의를 라이브중으로 변경하고 참여이력을 등록합니다.");
            Lecture lecture = lectureQueryService.queryLectureById(lectureId);
            LiveRoom liveRoom = null;

            if (!liveRoomQueryService.isLiveLecture(lectureId)) {
                liveRoom = liveRoomManagementService.openLiveRoom(lecture, roomName);
            log.debug("조회된 강의 {}", lecture);
            log.debug("조회된 라이브룸 {}", liveRoom);
            // 해당 강좌를 라이브 중으로 변경한다.
            courseManagementService.activateLiveState(courseId);
            log.debug("라이브룸으로 전환에 성공했습니다.");
            // 라이브에 참여한다.
            liveParticipationManagementService.participateIn(liveRoom, AuthenticationUtil.getSessionUsername());
            log.debug("라이브룸에 참여를 성공했습니다.");
            } else {
                log.debug("이미 라이브룸이 존재합니다.");
            }
        }
        User user = userQueryService.queryUserByEmail(AuthenticationUtil.getSessionUsername());

        // 챗봇 서버로 파일 다운로드 요청 전송하기.
        // 한 번에 다 넣는다?
        // 파일 다운로드
        // 볼륨에 저장하기
        // 로드하여 파싱하기
        // 임베딩 하기

        return new LivekitTokenResponse(token.toJwt(), roomName, user.getNickname(), user.getEmail(), user.getRole(), lectureId);
    }

    public void isParticipatable(Long lectureId, Long courseId) {
        // 학생은 이미 어떤 라이브에 참여중이거나, 해당 강좌를 수강신청하지 않았거나, 블랙리스트에 등록되었거나, 라이브중이 아니라면 참여할 수 없다.
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("참여중인 라이브가 있는지 검사함");
        if(liveParticipationQueryService.isInAnyLiveRoom(email)) {
            LiveParticipation participation = liveParticipationQueryService.queryLiveParticipationOf(lectureId, email);
            if(participation == null) throw new CanNotParticipateInLiveRoomException("참여 라이브 에러가 발생했습니다. 현재 방송 참여가 아닙니다.");
        }

        User user = userQueryService.queryUserByEmail(email);
        log.debug("수강신청한 강좌인지 검사함");
        if(!courseHistoryQueryService.enrolled(user.getId(), courseId)) {
            throw new CanNotParticipateInLiveRoomException("수강신청 하지 않은 강좌의 라이브에 참여할 수 없습니다.");
        }

        log.debug("블랙리스트에 등록되었는지 검사함");
        if(blacklistQueryService.isInBlacklistOf(user.getId(), courseId)) {
            throw new CanNotParticipateInLiveRoomException("블랙리스트로 처리된 강좌의 라이브에 참여할 수 없습니다.");
        }

        log.debug("강의가 라이브 중인지 검사함");
        if(!liveRoomQueryService.isLiveLecture(lectureId)) {
            throw new CanNotParticipateInLiveRoomException("해당 강의는 현재 라이브 중이 아닙니다.");
        }
        log.debug("검사 완료함.");
    }

    @Override
    public LivekitTokenResponse createStudentToken(Long lectureId, Long courseId) {
        if(!isTest) {
            isParticipatable(lectureId, courseId);
        }
        // 강좌 참여가 가능한 상태이다.
        // 토큰 발급 + 참여 처리.
        log.debug("학생 토큰 생성 서비스 호출됨. 강의 ID = {}, 강좌 ID = {}", lectureId, courseId);
        String roomName = this.getRoomIdOf(lectureId, false);
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("조회된 roomName = {}, email = {}", roomName, email);

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
            log.debug("테스트 환경이 아닙니다. 라이브룸 등록을 시작합니다.");
            // 참여중으로 등록해야 한다.
            LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
            log.debug("조회된 라이브룸 : {}", liveRoom);
            if(!liveParticipationQueryService.isInAnyLiveRoom(email)) liveParticipationManagementService.participateIn(liveRoom, email);
        }
        User user = userQueryService.queryUserByEmail(AuthenticationUtil.getSessionUsername());
        log.debug("라이브룸 참여가 완료되었습니다.");
        return new LivekitTokenResponse(token.toJwt(), roomName, user.getNickname(), user.getEmail(), user.getRole(), lectureId);
    }

    @Override
    public void prepareChatbot(Long lectureId) {
        chatBotService.setLiveRoomChatbot(lectureId);
    }

    @Override
    @Transactional
    public void closeLiveRoom(CloseLiveRequest request, String email) {
        log.debug("강의실 종료 API. 호출됨.");
        Lecture lecture = lectureQueryService.queryLectureById(request.getLectureId());
        User user = userQueryService.queryUserByEmail(email);
        log.debug("lecture, user를 조회함.");
        try {
            if (!courseQueryService.isInstructorOf(user.getId(), lecture.getCourseId())) {
                throw new InvalidUserRoleException("오직 강의의 강사만 라이브를 종료할 수 있습니다.");
            }
        } catch (Exception e) {
            throw new InvalidUserRoleException("오직 강의의 강사만 라이브를 종료할 수 있습니다.");
        }
        log.debug("Redis 서비스 호출.");
        roomRedisService.deleteRoom(lecture.getTitle(), lecture.getId());

        log.debug("데이터 베이스에서 제거");
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(request.getLectureId());
        List<LiveParticipation> participation = liveRoomManagementService.closeLiveRoom(liveRoom);

        List<LectureHistory> histories = participation.stream().map(
                p -> {
                    LectureHistory history = new LectureHistory();
                    User tu = userQueryService.queryUserByEmail(p.getEmail());
                    history.setUserId(tu.getId());
                    history.setLectureId(lecture.getId());
                    history.setAttendedAt(LocalDateTime.now());
                    return history;
                }
        ).toList();
        log.debug("참여 이력을 수강 이력 테이블에 저장합니다.");
        lectureHistoryRepository.saveAll(histories);
    }

    public String getRoomIdOf(Long lectureId, boolean instructor) {
        String lectureName = "test";
        if(!isTest) {
            lectureName = lectureQueryService.queryLectureById(lectureId).getTitle();
        }
        if(roomRedisService.isRoomOpened(lectureName, lectureId) || !instructor) {
            log.debug("이미 생성된 방 정보를 조회함, 강사? {}", instructor);
            return roomRedisService.getRoomId(lectureName, lectureId);
        }
        else {
            log.debug("새로운 강의실 ID를 저장함.");
            log.debug("챗봇을 준비한다.");
            this.prepareChatbot(lectureId);
            return roomRedisService.addRoomId(lectureName, lectureId);
        }
    }
}
