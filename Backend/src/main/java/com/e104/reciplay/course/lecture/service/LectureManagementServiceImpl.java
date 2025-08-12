package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.lecture.dto.LectureControlRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureRegisterRequest;
import com.e104.reciplay.course.lecture.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureUpdateRequest;
import com.e104.reciplay.course.lecture.dto.response.CourseTerm;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.repository.LectureRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.exception.FileUploadFailureException;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class LectureManagementServiceImpl implements LectureManagementService{
    private final LectureRepository lectureRepository;
    private final S3Service s3Service;
    private final ChapterManagementService chapterManagementService;
    private final UserQueryService userQueryService;
    private final CourseQueryService courseQueryService;
    private final LectureQueryService lectureQueryService;
    private final FileMetadataQueryService fileMetadataQueryService;

    @Transactional
    @Override
    public void updateSkipStatus(Long lectureId, boolean isSkipped, String email) {
        User user = userQueryService.queryUserByEmail(email);
        Lecture lecture = lectureQueryService.queryLectureById(lectureId);

        if(!courseQueryService.isInstructorOf(user.getId(),lecture.getCourseId())) {
            throw new InvalidUserRoleException("오직 해당 강좌 강사만 강의를 수정할 수 있습니다.");
        }

        lecture.setIsSkipped(isSkipped); // 엔티티의 필드 setter 사용
    }


    // update 로직
    @Transactional
    @Override
    public void updateLecture(List<LectureRequest> requests, Long courseId, String email) throws IOException {
        // 강좌 자체의 정보가 수정됨
        // 강좌에 대한 강의 자료가 수정됨
        // 강좌의 챕터들과 투두 리스트가 수정됨
        User user = userQueryService.queryUserByEmail(email);
        if(!courseQueryService.isInstructorOf(user.getId(), courseId)) {
            throw new InvalidUserRoleException("오직 해당 강좌 강사만 강의를 수정할 수 있습니다.");
        }
        checkSequence(requests);

        // 달라진 내역을 확인하기 위한 자료구조.
        List<Lecture> lectures = lectureQueryService.queryLecturesByCourseId(courseId);
        Map<Long, LectureRequest> requestMap = new HashMap<>(); // ID가 존재하는 강의 수정 요청을 ID별로 모아둔다.
        List<LectureRequest> nulls = new ArrayList<>(); // null인 요청 -> 새로 추가됨. 을 따로 모아둔다.

        // 강의의 id가 존재하는지 확인함.
        for(LectureRequest request : requests) {
            if(((LectureUpdateRequest)request.getRequest()).getLectureId() == null) nulls.add(request); // null 이면 nulls에 넣음.
            else requestMap.put(((LectureUpdateRequest)request.getRequest()).getLectureId(), request); // 아니라면 Id로 매핑해둠.
        }


        registerLectures(nulls, courseId, email); // ID가 null이라면 새로 추가해야 하므로, 추가 메서드를 호출한다.
        for(Lecture lecture : lectures) {

            LectureRequest request = requestMap.get(lecture.getId());
            // 강의 내용이 다르다면, 수정한다.
            // 다운 캐스팅
            LectureUpdateRequest updateRequest = (LectureUpdateRequest) request.getRequest();
            lecture.update(updateRequest);


            MultipartFile material = request.getMaterial();
            try {
                FileMetadata metadata = fileMetadataQueryService.queryLectureMaterial(lecture.getId());
                s3Service.deleteFile(metadata);
            } catch (Exception e) {
                log.debug("해당 파일이 없습니다. {}", e.getMessage());
            }
            s3Service.uploadFile(material, FileCategory.MATERIALS, RelatedType.LECTURE, lecture.getId(), 1);

        }

        chapterManagementService.updateChapterWithTodos(requestMap);
    }

    @Override
    public List<LectureRequest> groupLectureAndMaterial(List<? extends LectureControlRequest> lectureRequestList, MultipartHttpServletRequest multipartHttpServletRequest) {
        List<LectureRequest> result = new ArrayList<>();

        for (LectureControlRequest request : lectureRequestList) {
            result.add(new LectureRequest(request, null));
        }

        Iterator<String> fileNames = multipartHttpServletRequest.getFileNames();
        while(fileNames.hasNext()) {
            String name = fileNames.next();
            if(!name.startsWith("material/")) continue;
            String[] temp = name.split("/");
            if(temp.length < 2) {
                throw new IllegalArgumentException("강의자료 part name이 올바르지 않습니다. : material/강의목차번호");
            }

            List<MultipartFile> files = multipartHttpServletRequest.getFiles(name);
            if(files.size() > 1) throw new IllegalArgumentException("강의 당 하나의 자료만 첨부 가능합니다.");
            if(files.isEmpty()) continue;
            result.get(Integer.parseInt(temp[1])).setMaterial(files.get(0));
        }

        return result;
    }

    @Override
    @Transactional
    public CourseTerm registerLectures(List<LectureRequest> requests, Long courseId, String email) {
        User user = userQueryService.queryUserByEmail(email);
        checkSequence(requests);

        courseQueryService.queryCourseById(courseId); // 코스가 존재하는지 검증 가능함.
        if(!courseQueryService.isInstructorOf(user.getId(), courseId)) {
            throw new InvalidUserRoleException("오직 해당 강좌 강사만 강의를 등록할 수 있습니다.");
        }

        log.debug("강의 업로드");
        // 강의 먼저 저장함.
        List<Lecture> lectures = requests.stream().map(r -> new Lecture(r, courseId)).toList();
        lectureRepository.saveAll(lectures);
        log.debug("강의들을 저장함.");
        List<Long> lectureIds = lectures.stream().map(Lecture::getId).toList();

        LocalDate startDate = requests.get(0).getRequest().getStartedAt().toLocalDate();
        LocalDate endDate = requests.get(0).getRequest().getStartedAt().toLocalDate();

        // 강의별 자료 저장함.
        for(int i = 0; i < requests.size(); i++) {
            Long lectureId = lectureIds.get(i);
            MultipartFile file = requests.get(i).getMaterial();

            try {
                if(file != null) s3Service.uploadFile(file, FileCategory.MATERIALS, RelatedType.LECTURE, lectureId, i + 1);
            } catch (IOException e) {
                throw new FileUploadFailureException("스토리지에 강의자료 업로드 중 에러가 발생했습니다.");
            }

            LocalDate lectureStartDate = requests.get(i).getRequest().getStartedAt().toLocalDate();
            LocalDate lectureEndDate = requests.get(i).getRequest().getEndedAt().toLocalDate();
            startDate = (startDate.isAfter(lectureStartDate)) ? lectureStartDate : startDate;
            endDate = (endDate.isBefore(lectureEndDate)) ? lectureEndDate : endDate;
        }
        log.debug("챕터 메니지먼트 호출.");
        chapterManagementService.registChaptersWithTodos(requests, lectureIds);

        return new CourseTerm(startDate, endDate);
    }

    void checkSequence(List<LectureRequest> requests) {
        requests.sort((i, j) -> i.getRequest().getSequence() - j.getRequest().getSequence());
        for(int i = 1; i < requests.size(); i++) {
            if(requests.get(i).getRequest().getSequence() - 1 != requests.get(i-1).getRequest().getSequence())
                throw new IllegalArgumentException("순서가 정확하지 않습니다. (1부터 1씩 증가)");
        }
    }
}
