package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.admin.service.MessageManagementService;
import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.service.CanLearnManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.lecture.dto.response.CourseTerm;
import com.e104.reciplay.entity.Category;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.profile.service.LevelManagementService;
import com.e104.reciplay.user.profile.service.LevelManagementServiceImpl;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseManagementServiceImpl implements CourseManagementService{
    private final CourseRepository courseRepository;
    private final S3Service s3Service;
    private final CanLearnManagementService canLearnManagementService;
    private final CourseQueryService courseQueryService;
    private final SubFileMetadataQueryService subFileMetadataQueryService;
    private final SubFileMetadataManagementService subFileMetadataManagementService;
    private final InstructorQueryService instructorQueryService;
    private final UserQueryService userQueryService;
    private final MessageManagementService messageManagementService;
    private final CategoryQueryService categoryQueryService;
    private final LevelManagementService levelManagementService;

    private final String COURSE_CLOSE_MESSAGE = """
            [%s] 강좌가 종료되었습니다.
            %s 분야 레벨이 %d 향상되었습니다.
            """;

    @Override
    @Transactional
    public void activateLiveState(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
        course.setIsLive(true);
    }

    @Override
    @Transactional
    public Long createCourseByInstructorId (Long instructorId, RequestCourseInfo courseRegisterInfo, List<MultipartFile> thumbnailImages, MultipartFile courseCoverImage) {
        log.debug("createdCourses 호출.");
        Course course = new Course(courseRegisterInfo);
        course.setInstructorId(instructorId);
        courseRepository.save(course);
        // 강좌 커버 이미지와 썸네일 이미지들 업로드(저장)
        log.debug("강좌 커버 이미지와 썸네일 업로드");
        uploadImagesWithCourseId(course.getId(), courseCoverImage, thumbnailImages);
        // 인런걸 배울 수 있어요 저장
        canLearnManagementService.createCanLearnsWithCourseId(course.getId(), courseRegisterInfo.getCanLearns());
        return course.getId();
    }

    @Override
    @Transactional
    public Long updateCourseByCourseId(RequestCourseInfo requestCourseInfo, List<MultipartFile> thumbnailImages, MultipartFile courseCoverImage) {
        Long courseId = requestCourseInfo.getCourseId();
        Course course = courseQueryService.queryCourseById(courseId); // 강좌 찾기
        course.updateCourse(requestCourseInfo); // 강좌 수정
        courseRepository.save(course); // 수정된 강좌 정보 저장

        // 해당 강좌의 이런걸 배울 수 있어요 삭제
        canLearnManagementService.deleteCanLearnsByCourseId(courseId);
        // 강좌Id로 썸네일 이미지들과 강좌커버이미지의 메타데이터 찾기
        List<FileMetadata> oldThumbnailImages = subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail");
        FileMetadata oldCourseCoverImages = subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover");
        // 해당 강좌의 메타데이터들과 s3 파일들 모두 삭제
        for(FileMetadata data : oldThumbnailImages){
            s3Service.deleteFile(data);
            subFileMetadataManagementService.deleteMetadataByEntitiy(data);
        }
        s3Service.deleteFile(oldCourseCoverImages);
        subFileMetadataManagementService.deleteMetadataByEntitiy(oldCourseCoverImages);

        // 썸네일들과 강좌 커버 이미지 업로드
        uploadImagesWithCourseId(courseId, courseCoverImage,thumbnailImages);
        // 이런걸 배울 수 있어요 저장
        canLearnManagementService.createCanLearnsWithCourseId(courseId, requestCourseInfo.getCanLearns());

        return courseId;
    }

    // 여기도 트랜잭셔널 붙여야 하는가?
    @Transactional
    void uploadImagesWithCourseId(Long courseId, MultipartFile courseCoverImage,List<MultipartFile> thumbnailImages) {
        int thumbnailSequence = 1;
        // 강좌 커버 이미지 업로드
        try {
            s3Service.uploadFile(courseCoverImage, FileCategory.IMAGES, RelatedType.COURSE_COVER, courseId, 1);
        } catch (IOException e) {
            log.warn("S3 업로드 과정에서 문제가 발생했습니다. : {}", e.getMessage());
        }

        // 썸네일 이미지들 업로드
        for (MultipartFile file : thumbnailImages) {
            try {
                s3Service.uploadFile(file, FileCategory.IMAGES, RelatedType.THUMBNAIL, courseId, thumbnailSequence++);
            } catch (IOException e) {
                log.warn("S3 업로드 과정에서 문제가 발생했습니다. : {}", e.getMessage());
            }
        }
    }

    @Override
    public void setCourseTerm(CourseTerm term, Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
        course.setCourseStartDate(term.getStartDate());
        course.setCourseEndDate(term.getEndDate());
    }

    @Override
    @Transactional
    public void closeCourse(Long courseId, String email) {
        log.debug("closeCourse 호출됨.");
        Course course = courseQueryService.queryCourseById(courseId);
        Instructor instructor = instructorQueryService.queryInstructorById(course.getInstructorId());
        User user = userQueryService.queryUserById(instructor.getUserId());
        log.debug("course, instructor, user 조회.");
        if(!email.equals(user.getEmail())) {
            throw new InvalidUserRoleException("오직 강의의 강사만 종료시킬 수 있습니다.");
        }
        if(course.getCourseEndDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("아직 종료일이 지나지 않았습니다.");
        }

        List<User> students = courseQueryService.queryCourseUsers(courseId);
        for(User student : students) {
            log.debug("학생 {} 처리 중", student.getEmail());
            int levelDiff = courseQueryService.calcLevelAmount(courseId, student.getEmail());
            Category category = categoryQueryService.queryCategoryById(course.getCategoryId());
            log.debug("      {} 분야 레벨 {} 상승", category.getName(), levelDiff);
            levelManagementService.increaseLevelOf(category.getId(), student.getId(), levelDiff);
            log.debug("      메세지 전송함.");
            // 메세지 보내기
            messageManagementService.createMessage(instructor.getUserId(), student.getId(), COURSE_CLOSE_MESSAGE.formatted(
                    course.getTitle(), category.getName(),levelDiff
            ));
        }
    }
}
