package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.Chapter;
import com.e104_2.reciplaywebsocket.room.repository.ChapterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChapterQueryServiceImpl implements ChapterQueryService{
    private final ChapterRepository chapterRepository;

    @Override
    public Chapter queryChapterByLectureIdAndSequence(Long lectureId, Integer sequence) {
        return chapterRepository.findByLectureIdAndSequence(lectureId, sequence)
                .orElseThrow(()-> new IllegalArgumentException("해당 강의에는 "+sequence+"번 챕터가 없습니다."));
    }
}
