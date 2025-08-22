package com.e104.reciplay.bot.service;

import com.e104.reciplay.bot.dto.request.LecturePreparation;
import com.e104.reciplay.bot.dto.request.item.LectureAndMaterial;
import com.e104.reciplay.bot.dto.response.GeneratedLecture;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatBotServiceImpl implements ChatBotService{
    private final WebClient webClient;
    private final FileMetadataQueryService fileMetadataQueryService;
    private final S3Service s3Service;
    private final ObjectMapper objectMapper;

    @Value("${ai.llm.baseurl}")
    private String BASE_URL;

    // 유효성을 검증할 것.
    @Override
    public void setLiveRoomChatbot(Long lectureId) {
        ResponseFileInfo fileInfo = null;
        try {
            FileMetadata metadata = fileMetadataQueryService.queryLectureMaterial(lectureId);
            fileInfo = s3Service.getResponseFileInfo(metadata);

        } catch(Exception e) {
            log.debug("챗봇 준비중 강의자료를 찾지 못했습니다.");
        }

        LecturePreparation lecturePackage = new LecturePreparation();
        lecturePackage.setLectureId(lectureId);

        if(fileInfo != null) {
            lecturePackage.setMaterialUrl(fileInfo.getPresignedUrl());
        }
        try {
            Map<String, String> data = Map.of("FileUrl", fileInfo.getPresignedUrl());
            Mono<Void> mono = webClient.post()
                    .uri(BASE_URL + "/chatbot/file/download")
                    .bodyValue(data)
                    .retrieve().bodyToMono(Void.class);

            mono.subscribe(); // 비동기 호출함.
        } catch (Exception e) {
            log.debug("강의 자료가 없는 경우 NPE 발생합니다. {}", e.getMessage());
        }
    }

    @Override
    public List<GeneratedLecture> generateTodoList(List<LectureAndMaterial> request) {
        Mono<String> responseMono = webClient.post().uri(BASE_URL+"/generate-todos/")
                .bodyValue(request).retrieve().bodyToMono(String.class);
        try {
            return this.parseChatBotResult(Objects.requireNonNull(responseMono.block()));
        } catch (IOException | NullPointerException e) {
            log.info("에러 발생. 챗봇 응답을 파싱하면서 IOException 또는 NPE 발생함. {}", e.getMessage());
            return List.of();
        }
    }

    @Override
    public void sendLectureInfo(LecturePreparation preparation) {

    }

    private List<GeneratedLecture> parseChatBotResult(String src) throws IOException {
        log.debug("파싱 대상 : {}", src);
        List<GeneratedLecture> result = objectMapper.readValue(src.getBytes(StandardCharsets.UTF_8), new TypeReference<List<GeneratedLecture>>() {});

        log.debug("파싱 성공");
        return result;
    }
}
