package com.e104.reciplay.livekit.service;

import com.e104.reciplay.livekit.service.depends.LectureQueryService;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class LivekitControlServiceImpl implements LivekitControlService{
    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    @Value("${livekit.server.url}")
    private String LIVEKIT_SERVER_URL;

    @Value("${spring.wonjun.test}")
    Boolean isTest;

    private final LectureQueryService lectureQueryService;


    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void disconnectStudent(Long lectureId, String targetEmail) {
        String roomName = getRoomNameOf(lectureId);
        String url = String.format("%s/rooms/%s/participants/%s/disconnect", LIVEKIT_SERVER_URL, roomName, targetEmail);

        postControlMessage(url, null);
    }

    @Override
    public void muteStudent(Long lectureId, String targetEmail) {

    }

    @Override
    public void unpublishStudent(String roomName, String targetEmail) {

    }

    public void postControlMessage(String url, Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(createLivekitJWT());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> request = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(url, request, Void.class);
    }

    public String createLivekitJWT() {
        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setIdentity("server-admin");
        return token.toJwt();
    }

    public String getRoomNameOf(Long lectureId) {
        return isTest ? "testRoom" + lectureId : lectureQueryService.queryLectrueById(lectureId).getTitle() + lectureId.toString();
    }
}
