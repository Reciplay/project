package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LectureQueryServiceImpl implements LectureQueryService {
    private final LectureRepository lectureRepository;

    @Override
    public Lecture queryLectrueById(Long id) {
        return lectureRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당하는 ID의 강의(Lecture)가 없습니다."));
    }
}
