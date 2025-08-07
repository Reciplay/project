package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.entity.Chapter;
import com.e104.reciplay.repository.ChapterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChapterManagementServiceImpl implements ChapterManagementService{
    private final ChapterRepository chapterRepository;

    @Override
    public void registChaptersWithTodos(ChapterItem chapterItem, Long lectureId) {
        Chapter newChapter = new Chapter(chapterItem, lectureId);

    }
}
