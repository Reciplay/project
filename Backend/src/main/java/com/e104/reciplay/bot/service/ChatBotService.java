package com.e104.reciplay.bot.service;

import com.e104.reciplay.bot.dto.request.LecturePreparation;
import com.e104.reciplay.bot.dto.request.item.LectureAndMaterial;
import com.e104.reciplay.bot.dto.response.GeneratedLecture;

import java.util.List;

public interface ChatBotService {
    void setLiveRoomChatbot(Long lectureId);
    List<GeneratedLecture> generateTodoList(List<LectureAndMaterial> request);
    void sendLectureInfo(LecturePreparation preparation);
}
