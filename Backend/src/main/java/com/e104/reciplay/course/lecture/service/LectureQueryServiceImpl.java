package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.CourseNotFoundException;
import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.ChapterInfo;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import com.e104.reciplay.course.lecture.repository.ChapterQueryRepository;
import com.e104.reciplay.course.lecture.repository.LectureQueryRepository;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LectureQueryServiceImpl implements LectureQueryService{
    private final LectureQueryRepository lectureQueryRepository;
    private final CourseRepository courseRepository;
    private final ChapterQueryRepository chapterQueryRepository;
    private final LectureRepository lectureRepository;
    @Override
    public List<LectureSummary> getLectureSummaries(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException(courseId);
        }
        return lectureQueryRepository.findLectureSummariesByCourseId(courseId);
    }


    @Override
    @Transactional(readOnly = true)
    public LectureDetail getLectureDetail(Long lectureId) {
        LectureDetail detail = lectureQueryRepository.findLectureDetailById(lectureId);
        if (detail == null) {
            throw new LectureNotFoundException(lectureId);
        }

        List<ChapterInfo> chapters = chapterQueryRepository.findChaptersWithTodosByLectureId(lectureId);
        detail.setChapters(chapters);

        return detail;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LectureDetail> getLectureDetails(Long courseId) {
        List<LectureDetail> details = lectureQueryRepository.findLectureDetailsByCourseId(courseId);
        if (details == null || details.isEmpty()) {
            throw new CourseNotFoundException(courseId);
        }

        for (LectureDetail detail : details) {
            List<ChapterInfo> chapters = chapterQueryRepository.findChaptersWithTodosByLectureId(detail.getLectureId());
            detail.setChapters(chapters);
        }

        return details;
    }
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

        lecture.setTitle(detail.getName());          // 강의 명
        lecture.setSummary(detail.getSummary());   // 강의 요약
        lecture.setMaterials(detail.getMaterials()); // 강의 준비물
        //강의 자료 업데이트는 추후 작성
    }
}
