package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LectureManagementServiceImpl implements LectureManagementService{
    private final LectureRepository lectureRepository;
    @Transactional
    @Override
    public void updateSkipStatus(Long lectureId, boolean isSkipped) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureNotFoundException(lectureId));

        lecture.setIsSkipped(isSkipped); // 엔티티의 필드 setter 사용
    }
    @Transactional
    @Override
    public void updateLecture(LectureDetail detail) {
        Lecture lecture = lectureRepository.findById(detail.getLectureId())
                .orElseThrow(() -> new LectureNotFoundException(detail.getLectureId()));

        lecture.setTitle(detail.getTitle());          // 강의 명
        lecture.setSummary(detail.getSummary());   // 강의 요약
        lecture.setMaterials(detail.getMaterials()); // 강의 준비물
        //강의 자료 업데이트는 추후 작성
    }

}
