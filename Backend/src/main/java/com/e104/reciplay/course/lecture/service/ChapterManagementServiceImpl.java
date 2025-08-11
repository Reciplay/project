package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureUpdateRequest;
import com.e104.reciplay.entity.Chapter;
import com.e104.reciplay.repository.ChapterRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChapterManagementServiceImpl implements ChapterManagementService{
    private final ChapterRepository chapterRepository;
    private final TodoManagementService todoManagementService;

    @Override
    public void registChaptersWithTodos(List<LectureRequest> requests, List<Long> lectureIds) {
        List<Chapter> chapters = new ArrayList<>();
        // 묶어서 TodoManagementService에 보내줄 데이터
        // 각 chapter의 ID와 TodoList들
        for(int i = 0; i < requests.size(); i++) {
            LectureRequest registerRequest = requests.get(i);
            Long lectureId = lectureIds.get(i);
            for(ChapterItem chapterItem : registerRequest.getRequest().getChapterList()) {
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

    @Override
    @Transactional
    public void updateChapterWithTodos(Map<Long, LectureRequest> requestMap) {
        Set<Long> idSet = requestMap.keySet();
        for(Long lectureId : idSet) {
            // 챕터들을 모아서 비교해본다 (아이디 값)
            LectureUpdateRequest request = (LectureUpdateRequest) requestMap.get(lectureId).getRequest();
            List<ChapterItem> chapterItems = request.getChapterList();
            List<Chapter> nulls = new ArrayList<>();
            Map<Long, ChapterItem> itemMap = new HashMap<>();

            for(ChapterItem item : chapterItems) {
                if(item.getId() == null) nulls.add(new Chapter(item, lectureId));
                else itemMap.put(item.getId(), item);
            }

            chapterRepository.saveAll(nulls);

            List<Chapter> chapters = chapterRepository.findByLectureId(lectureId);
            for(Chapter chapter : chapters) {
                chapter.update(itemMap.get(chapter.getId()));
            }
        }


    }
}
