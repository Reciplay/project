package com.e104.reciplay.bot.service;

import com.e104.reciplay.bot.dto.request.GenerateTodoRequest;
import com.e104.reciplay.bot.dto.request.LecturePreparation;
import com.e104.reciplay.bot.dto.response.GenerateTodoResponse;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatBotServiceImpl implements ChatBotService{
    private final WebClient webClient;
    private final FileMetadataQueryService fileMetadataQueryService;
    private final S3Service s3Service;

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
        ㄴ
        Mono<Void> mono = webClient.post()
                .uri(BASE_URL+"/chatbot/file/download")
                .bodyValue(new LecturePreparation())
                .retrieve().bodyToMono(Void.class);

        mono.subscribe(); // 비동기 호출함.
    }

    @Override
    public GenerateTodoResponse generateTodoList(GenerateTodoRequest request) {
        Mono<GenerateTodoResponse> responseMono = webClient.post().uri(BASE_URL+"")
                .bodyValue(request).retrieve().bodyToMono(GenerateTodoResponse.class);
        return responseMono.block();
    }

    @Override
    public void sendLectureInfo(LecturePreparation preparation) {

    }
}
