package com.e104.reciplay.bot.service;

import com.e104.reciplay.bot.dto.request.GenerateTodoRequest;
import com.e104.reciplay.bot.dto.request.LecturePreparation;
import com.e104.reciplay.bot.dto.response.GenerateTodoResponse;

public interface ChatBotService {
    void setLiveRoomChatbot(Long lectureId);
    GenerateTodoResponse generateTodoList(GenerateTodoRequest request);
    void sendLectureInfo(LecturePreparation preparation);
}
