package com.e104_2.reciplaywebsocket.room.service;


import com.e104_2.reciplaywebsocket.entity.Course;
import com.e104_2.reciplaywebsocket.entity.Instructor;
import com.e104_2.reciplaywebsocket.entity.Lecture;
import com.e104_2.reciplaywebsocket.entity.LiveRoom;
import com.e104_2.reciplaywebsocket.room.dto.request.LiveControlRequest;
import com.e104_2.reciplaywebsocket.room.redis.ForceQuitRedisService;
import com.e104_2.reciplaywebsocket.room.service.addtional.*;
import io.livekit.server.RoomServiceClient;
import jdk.jfr.StackTrace;
import livekit.LivekitModels;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import retrofit2.Call;
import retrofit2.Response;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveControlServiceImpl implements LiveControlService{

    @Value("${application.is-test}") Boolean test;
    @Value("${application.admin-key}") String adminKey;

    private final LiveRoomQueryService liveRoomQueryService;
    private final LiveParticipationQueryService liveParticipationQueryService;
    private final LiveParticipationManagementService liveParticipationManagementService;
    private final LectureQueryService lectureQueryService;
    private final RoomServiceClient roomServiceClient;
    private final CourseQueryService courseQueryService;
    private final InstructorQueryService instructorQueryService;
    private final UserQueryService userQueryService;


    // Redis
    private final ForceQuitRedisService forceQuitRedisService;


    // 테스트 환경인지, 강제 퇴장 대상인지, 라이브 참여자인지 를 검사한다.
    // true : 유효함.
    @Override
    public Boolean checkParticipationPrivilege(String email, LiveControlRequest request) {
        if(test) return true;

        if(forceQuitRedisService.isOnQuitList(email, request.getRoomId())) {
            try {
                this.removeParticipant(request, adminKey);
                return false;
            } catch (IOException e) {
                log.warn("해당 회원은 강제 퇴장 이력이 있으며, 참여 거부 과정에서 문제가 발생했습니다. can not force quit");
                log.warn(e.getMessage());
                for(StackTraceElement trace : e.getStackTrace()) {
                    log.warn(trace.toString());
                }
                return false;
            }
        }
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(request.getLectureId());
        return liveParticipationQueryService.queryUserParticipatedIn(email, liveRoom.getId());
    }

    @Override
    public void quitFromLiveRoom(String email, Long lectureId) {
        // 단순히 나가는 동작은 금지하지 않는다.
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
        liveParticipationManagementService.quitFromLiveRoom(liveRoom.getId(), email);
    }

    @Override
    public void removeParticipant(LiveControlRequest request, String userEmail) throws IOException {
        verifyRemovePrivilege(request.getLectureId(), request.getTargetEmail(), userEmail);

        // join 메세지를 검증할 때 사용한다.
        // 레디스 강제 퇴장 셋에 저장한다.
        forceQuitRedisService.addUserInForceQuit(request.getTargetEmail(), request.getRoomId());

        Call<Void> call = roomServiceClient.removeParticipant(request.getRoomId(), request.getTargetEmail());
        Response<Void> response = call.execute();


        if(!response.isSuccessful()) throw new IllegalStateException("퇴장에 실패했습니다.");
    }

    @Override
    public void verifyRemovePrivilege(Long lectureId, String email, String userEmail) {
//        verifyPrivilege(lectureId, email, userEmail, "강의의 지도 강사가 아니라면 강퇴할 수 업습니다.");
    }

    @Override
    public void muteAudio(LiveControlRequest request, String userEmail) throws IOException {
        verifyAudioMutePrivilege(request.getLectureId(), request.getTargetEmail(), userEmail);
        this.mutePublishedChannel(request.getRoomId(), request.getTargetEmail(), LivekitModels.TrackType.AUDIO, true);
    }

    @Override
    public void verifyAudioMutePrivilege(Long lectureId, String email, String userEmail) {
//        verifyPrivilege(lectureId, email, userEmail, "오디오 제어 권한이 업습니다.");
    }

    @Override
    public void unmuteAudio(LiveControlRequest request, String userEmail) throws IOException {
        verifyAudioMutePrivilege(request.getLectureId(), request.getTargetEmail(), userEmail);

        this.mutePublishedChannel(request.getRoomId(), request.getTargetEmail(), LivekitModels.TrackType.AUDIO, false);
    }

    @Override
    public void muteVideo(LiveControlRequest request, String userEmail) throws IOException {
        verifyVideoMutePrivilege(request.getLectureId(), request.getTargetEmail(), userEmail);
        this.mutePublishedChannel(request.getRoomId(), request.getTargetEmail(), LivekitModels.TrackType.VIDEO, true);
    }

    @Override
    public void unmuteVideo(LiveControlRequest request, String userEmail) throws IOException {
        verifyVideoMutePrivilege(request.getLectureId(), request.getTargetEmail(), userEmail);
        this.mutePublishedChannel(request.getRoomId(), request.getTargetEmail(), LivekitModels.TrackType.VIDEO, false);
    }

    @Override
    public void verifyVideoMutePrivilege(Long lectureId, String email, String userEmail) {
//        verifyPrivilege(lectureId, email, userEmail, "비디오 송출 제어 권한이 없습니다.");
    }

    @Override
    public void mutePublishedChannel(String roomName, String identity, LivekitModels.TrackType type, boolean mute) throws IOException{
        Call<LivekitModels.ParticipantInfo> call = roomServiceClient.getParticipant(roomName, identity);
        Response<LivekitModels.ParticipantInfo> response = call.execute();
        log.debug("발견한 사용자 정보 : {}", response);

        assert response.body() != null;

        for(LivekitModels.TrackInfo trackInfo : response.body().getTracksList()) {
            if(trackInfo.getType() == type) {
                log.debug("제어할 트랙 : {}, {}, {}", trackInfo.getType(), trackInfo.getSid(), mute);
                String sid = trackInfo.getSid();
                Call<LivekitModels.TrackInfo> muteCall = roomServiceClient.mutePublishedTrack(roomName, identity, sid, mute);
                muteCall.execute();
            }
        }
    }

    @Override
    public String getLiveInstructorIdentity(Long lectureId) {
        Long courseId = lectureQueryService.queryLectureById(lectureId).getCourseId();
        Long instructorId = courseQueryService.queryCourseById(courseId).getInstructorId();
        Instructor instructor = instructorQueryService.queryInstructorById(instructorId);
        return userQueryService.queryUserById(instructor.getUserId()).getEmail();
    }

    @Override
    public boolean isInstructorOfLecture(String email, Long lectureId) {
        Course course = courseQueryService.queryCourseOfLecture(lectureId);
        Instructor instructor = instructorQueryService.queryInstructorByEmail(email);
        return course.getInstructorId().equals(instructor.getId());
    }

//    public void verifyPrivilege(Long lectureId, String email, String userEmail, String msg) {
//        log.debug("권한을 확인합니다.");
//        if(test) return;
//        if(userEmail.equals(adminKey)) return; // admin 권한으로 강제 퇴장.
//        Lecture lecture = lectureQueryService.queryLectureById(lectureId);
//        Course course = courseQueryService.queryCourseById(lecture.getCourseId());
//        Instructor instructor = instructorQueryService.queryInstructorByEmail(userEmail);
//
//        if(email.equals(userEmail)) throw new IllegalStateException("자기자신은 제한할 수 없습니다.");
//        if(!course.getInstructorId().equals(instructor.getId())) throw new IllegalStateException(msg);
//    }
}
