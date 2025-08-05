package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.CourseNotFoundException;
import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
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

    @Override
    public List<LectureSummary> queryLectureSummaries(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException(courseId);
        }
        return lectureQueryRepository.findLectureSummariesByCourseId(courseId);
    }


    @Override
    @Transactional(readOnly = true)
    public LectureDetail queryLectureDetail(Long lectureId) {
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
    public List<LectureDetail> queryLectureDetails(Long courseId) {
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
}
