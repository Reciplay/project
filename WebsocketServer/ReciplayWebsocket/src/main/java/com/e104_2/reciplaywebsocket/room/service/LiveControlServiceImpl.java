package com.e104_2.reciplaywebsocket.room.service;


import com.e104_2.reciplaywebsocket.entity.Course;
import com.e104_2.reciplaywebsocket.entity.Instructor;
import com.e104_2.reciplaywebsocket.entity.Lecture;
import com.e104_2.reciplaywebsocket.entity.LiveRoom;
import com.e104_2.reciplaywebsocket.room.redis.ForceQuitRedisService;
import com.e104_2.reciplaywebsocket.room.service.addtional.*;
import io.livekit.server.RoomServiceClient;
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

    // Redis
    private final ForceQuitRedisService forceQuitRedisService;

    @Override
    public Boolean checkParticipationPrivilege(String email, Long lectureId) {
        if(test) return true;

        if(forceQuitRedisService.isOnQuitList(email, lectureId)) {
            try {
                this.removeParticipant(lectureId, email, adminKey);
                return false;
            } catch (IOException e) {
                log.warn("해당 회원은 강제 퇴장 이력이 있으며, 참여 거부 과정에서 문제가 발생했습니다. can not force quit");
                log.warn(e.getMessage());
                e.printStackTrace();
                return false;
            }
        }
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
        return liveParticipationQueryService.queryUserParticipatedIn(email, liveRoom.getId());
    }

    @Override
    public void quitFromLiveRoom(String email, Long lectureId) {
        // 단순히 나가는 동작은 금지하지 않는다.
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
        liveParticipationManagementService.quitFromLiveRoom(liveRoom.getId(), email);
    }

    @Override
    public void removeParticipant(Long lectureId, String email, String userEmail) throws IOException {
        String roomName = getRoomName(lectureId);

        verifyRemovePrivilege(lectureId, email, userEmail);

        // join 메세지를 검증할 때 사용한다.
        // 레디스 강제 퇴장 셋에 저장한다.
        forceQuitRedisService.addUserInForceQuit(email, lectureId);

        Call<Void> call = roomServiceClient.removeParticipant(roomName, email);
        Response<Void> response = call.execute();


        if(!response.isSuccessful()) throw new IllegalStateException("퇴장에 실패했습니다.");
    }

    @Override
    public void verifyRemovePrivilege(Long lectureId, String email, String userEmail) {
        verifyPrivilege(lectureId, email, userEmail, "강의의 지도 강사가 아니라면 강퇴할 수 업습니다.");
    }

    @Override
    public void muteStudent(Long lectureId, String email, String userEmail) {
        String roomName = getRoomName(lectureId);

        verifyMutePrivilege(lectureId, email, userEmail);

        roomServiceClient.mutePublishedTrack()
    }

    @Override
    public void verifyMutePrivilege(Long lectureId, String email, String userEmail) {
        verifyPrivilege(lectureId, email, userEmail, "강의의 지도 강사가 아니라면 음소거할 수 업습니다.");
    }

    @Override
    public void unpublishStudent(String roomName, String targetEmail) {

    }

    public String getRoomName(Long lectureId) {
        return test ? "testRoom"+lectureId : lectureQueryService.queryLectureById(lectureId).getTitle()+lectureId;
    }

    public void verifyPrivilege(Long lectureId, String email, String userEmail, String msg) {
        if(userEmail.equals(adminKey)) return; // admin 권한으로 강제 퇴장.
        Lecture lecture = lectureQueryService.queryLectureById(lectureId);
        Course course = courseQueryService.queryCourseById(lecture.getCourseId());
        Instructor instructor = instructorQueryService.queryInstructorByEmail(userEmail);

        if(email.equals(userEmail)) throw new IllegalStateException("자기자신은 제한할 수 없습니다.");
        if(!course.getInstructorId().equals(instructor.getId())) throw new IllegalStateException(msg);
    }
}
