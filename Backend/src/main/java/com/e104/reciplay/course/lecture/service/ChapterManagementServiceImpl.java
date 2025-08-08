package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import com.e104.reciplay.entity.Chapter;
import com.e104.reciplay.repository.ChapterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChapterManagementServiceImpl implements ChapterManagementService{
    private final ChapterRepository chapterRepository;
    private final TodoManagementService todoManagementService;

    @Override
    public void registChaptersWithTodos(List<LectureRegisterRequest> requests, List<Long> lectureIds) {
        List<Chapter> chapters = new ArrayList<>();
        // 묶어서 TodoManagementService에 보내줄 데이터
        // 각 chapter의 ID와 TodoList들
        for(int i = 0; i < requests.size(); i++) {
            LectureRegisterRequest registerRequest = requests.get(i);
            Long lectureId = lectureIds.get(i);
            for(ChapterItem chapterItem : registerRequest.getLectureRequest().getChapterList()) {
                chapters.add(new Chapter(chapterItem, lectureId));
            }
        }
        chapterRepository.saveAll(chapters);

        ArrayDeque<Long> chapterIds = new ArrayDeque<>();
        for(Chapter chapter : chapters) {
            chapterIds.offer(chapter.getId());
        }

        todoManagementService.registerTodoItems(requests, chapterIds);
    }
}
