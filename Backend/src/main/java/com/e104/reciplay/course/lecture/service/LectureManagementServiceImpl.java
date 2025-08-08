package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import com.e104.reciplay.course.lecture.dto.response.response.CourseTerm;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.repository.LectureRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.exception.FileUploadFailureException;
import com.e104.reciplay.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LectureManagementServiceImpl implements LectureManagementService{
    private final LectureRepository lectureRepository;
    private final S3Service s3Service;
    private final ChapterManagementService chapterManagementService;

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

    @Override
    public List<LectureRegisterRequest> groupLectureAndMaterial(List<LectureRequest> lectureRequestList, MultipartHttpServletRequest multipartHttpServletRequest) {
        List<LectureRegisterRequest> result = new ArrayList<>();

        for (LectureRequest lectureRequest : lectureRequestList) {
            result.add(new LectureRegisterRequest(lectureRequest, null));
        }

        Iterator<String> fileNames = multipartHttpServletRequest.getFileNames();
        while(fileNames.hasNext()) {
            String name = fileNames.next();
            if(!name.startsWith("material/")) continue;
            String[] temp = name.split("/");
            if(temp.length < 2) {
                throw new IllegalArgumentException("강의자료 part name이 올바르지 않습니다. : material/강의목차번호");
            }

            int idx = Integer.parseInt(temp[1]);
            if(result.get(idx).getMaterial() != null) throw new IllegalArgumentException("한 강의에 복수 개의 강의자료를 등록할 수 없습니다.");
            result.get(idx).setMaterial(multipartHttpServletRequest.getFile(name));
        }

        return result;
    }

    @Override
    @Transactional
    public CourseTerm registerLectures(List<LectureRegisterRequest> requests, Long courseId) {
        // 강의 먼저 저장함.
        List<Lecture> lectures = requests.stream().map(r -> new Lecture(r, courseId)).toList();
        lectureRepository.saveAll(lectures);
        List<Long> lectureIds = lectures.stream().map(Lecture::getId).toList();

        LocalDate startDate = requests.get(0).getLectureRequest().getStartedAt().toLocalDate();
        LocalDate endDate = requests.get(0).getLectureRequest().getStartedAt().toLocalDate();

        // 강의별 자료 저장함.
        for(int i = 0; i < requests.size(); i++) {
            Long lectureId = lectureIds.get(i);
            MultipartFile file = requests.get(i).getMaterial();

            try {
                if(file != null) s3Service.uploadFile(file, FileCategory.MATERIALS, RelatedType.LECTURE, lectureId, i + 1);
            } catch (IOException e) {
                throw new FileUploadFailureException("스토리지에 강의자료 업로드 중 에러가 발생했습니다.");
            }

            LocalDate lectureStartDate = requests.get(i).getLectureRequest().getStartedAt().toLocalDate();
            LocalDate lectureEndDate = requests.get(i).getLectureRequest().getEndedAt().toLocalDate();
            startDate = (startDate.isAfter(lectureStartDate)) ? lectureStartDate : startDate;
            endDate = (endDate.isBefore(lectureEndDate)) ? lectureEndDate : endDate;
        }

        chapterManagementService.registChaptersWithTodos(requests, lectureIds);

        return new CourseTerm(startDate, endDate);
    }

}
