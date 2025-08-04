package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.Lecture;
import com.e104_2.reciplaywebsocket.room.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@RequiredArgsConstructor
public class LectureQueryServiceImpl implements LectureQueryService{
    private final LectureRepository lectureRepository;
    @Override
    public Lecture queryLectureById(Long lectureId) {
        return lectureRepository.findById(lectureId).orElseThrow(() -> new IllegalArgumentException("해당 강의가 존재하지 않습니다."));
    }
}
