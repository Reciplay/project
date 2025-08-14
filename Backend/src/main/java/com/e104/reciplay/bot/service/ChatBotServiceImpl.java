package com.e104.reciplay.bot.service;

import com.e104.reciplay.bot.dto.request.LecturePreparation;
import com.e104.reciplay.bot.dto.response.GenerateTodoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatBotServiceImpl implements ChatBotService{
    private final WebClient webClient;


    @Value("${ai.llm.baseurl}")
    private String BASE_URL;
    @Override
    public void setLiveRoomChatbot() {
//        String url =
//        webClient.post()
//                .uri(BASE_URL+"/chatbot/file/download")
//                .bodyValue(new LecturePreparation());
    }

    @Override
    public GenerateTodoResponse generateTodoList() {
        return null;
    }

    @Override
    public void sendLectureInfo(LecturePreparation preparation) {

    }
}
