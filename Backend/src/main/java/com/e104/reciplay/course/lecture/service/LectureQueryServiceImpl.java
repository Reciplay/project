package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.CourseNotFoundException;
import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.ChapterInfo;
import com.e104.reciplay.course.lecture.dto.LectureSummary;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.repository.ChapterRepository;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.LectureHistoryRepository;
import com.e104.reciplay.repository.LectureRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class LectureQueryServiceImpl implements LectureQueryService{
    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final FileMetadataQueryService fileMetadataQueryService;
    private final S3Service s3Service;
    private final UserQueryService userQueryService;
    private final LectureHistoryRepository lectureHistoryRepository;


    @Override
    public List<LectureSummary> queryLectureSummaries(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException(courseId);
        }
        return lectureRepository.findLectureSummariesByCourseId(courseId);
    }


    @Override
    @Transactional(readOnly = true)
    public LectureDetail queryLectureDetail(Long lectureId) {
        LectureDetail detail = lectureRepository.findLectureDetailById(lectureId);
        if (detail == null) {
            throw new LectureNotFoundException(lectureId);
        }

        List<ChapterInfo> chapters = chapterRepository.findChaptersWithTodosByLectureId(lectureId);
        detail.setChapters(chapters);

        detail.setLectureMaterial(this.getLectureMaterial(detail.getLectureId()));
        detail.setTaken(this.isTaken(detail.getLectureId()));

        return detail;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LectureDetail> queryLectureDetails(Long courseId) {
        List<LectureDetail> details = lectureRepository.findLectureDetailsByCourseId(courseId);
        if (details == null || details.isEmpty()) {
            throw new CourseNotFoundException(courseId);
        }

        for (LectureDetail detail : details) {
            List<ChapterInfo> chapters = chapterRepository.findChaptersWithTodosByLectureId(detail.getLectureId());
            detail.setChapters(chapters);
            detail.setLectureMaterial(this.getLectureMaterial(detail.getLectureId()));
            detail.setTaken(this.isTaken(detail.getLectureId()));
        }

        return details;
    }

    @Override
    public List<Lecture> queryLecturesByCourseId(Long courseId) {
        return lectureRepository.findByCourseId(courseId);
    }

    @Override
    public Lecture queryLectureById(Long id) {
        return lectureRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당하는 ID의 강의(Lecture)가 없습니다."));
    }

    @Override
    public Long queryCountByCourseId(Long courseId) {
        return lectureRepository.countByCourseId(courseId);
    }

    private ResponseFileInfo getLectureMaterial(Long lectureId) {
        try {
            FileMetadata metadata = fileMetadataQueryService.queryLectureMaterial(lectureId);
            return s3Service.getResponseFileInfo(metadata);
        } catch (Exception e) {
            log.debug("파일 메타데이터 예외 발생 : {}", e.getMessage());
            return null;
        }
    }

    private boolean isTaken(Long lectureId) {
        if(SecurityContextHolder.getContext() != null) {
            User user = userQueryService.queryUserByEmail(AuthenticationUtil.getSessionUsername());
            return lectureHistoryRepository.existsByLectureIdAndUserId(lectureId, user.getId());
        }
        return false;
    }
}
