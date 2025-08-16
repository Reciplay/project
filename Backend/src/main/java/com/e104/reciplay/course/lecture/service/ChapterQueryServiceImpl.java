package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.entity.Chapter;
import com.e104.reciplay.repository.ChapterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterQueryServiceImpl implements ChapterQueryService{
    private final ChapterRepository chapterRepository;

    @Override
    public List<Chapter> queryChaptersByLectureId(Long lectureId) {
        return chapterRepository.findByLectureId(lectureId);
    }
}
