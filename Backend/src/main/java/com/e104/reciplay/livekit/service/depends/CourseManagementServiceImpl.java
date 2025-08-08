package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.service.CanLearnManagementService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Override
    @Transactional
    public void activateLiveState(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
        course.setIsLive(true);
    }

    @Override
    @Transactional
    public void createCourseByInstructorId (Long instructorId, RequestCourseInfo courseRegisterInfo, List<MultipartFile> thumbnailImages, MultipartFile courseCoverImage) {
        Course course = new Course(courseRegisterInfo);
        course.setInstructorId(instructorId);
        courseRepository.save(course);
        // 강좌 커버 이미지와 썸네일 이미지들 업로드(저장)
        uploadImagesWithCourseId(course.getId(), courseCoverImage, thumbnailImages);
        // 인런걸 배울 수 있어요 저장
        canLearnManagementService.createCanLearnsWithCourseId(course.getId(), courseRegisterInfo.getCanLearns());
    }

    @Override
    @Transactional
    public void updateCourseByCourseId(RequestCourseInfo requestCourseInfo, List<MultipartFile> thumbnailImages, MultipartFile courseCoverImage) {
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
            subFileMetadataQueryService.deleteMetadataByEntitiy(data);
        }
        s3Service.deleteFile(oldCourseCoverImages);

        subFileMetadataQueryService.deleteMetadataByEntitiy(oldCourseCoverImages);
        // 썸네일들과 강좌 커버 이미지 업로드
        uploadImagesWithCourseId(courseId, courseCoverImage,thumbnailImages);
        // 이런걸 배울 수 있어요 저장
        canLearnManagementService.createCanLearnsWithCourseId(courseId, requestCourseInfo.getCanLearns());


    }

    // 여기도 트랜잭셔널 붙여야 하는가?
    @Transactional
    void uploadImagesWithCourseId(Long courseId, MultipartFile courseCoverImage,List<MultipartFile> thumbnailImages){
        int thumbnailSequence = 1;
        // 강좌 커버 이미지 업로드
        try {
            s3Service.uploadFile(courseCoverImage, FileCategory.IMAGES, RelatedType.COURSE_COVER, courseId, 1);
        } catch (IOException e) {
            log.warn("S3 업로드 과정에서 문제가 발생했습니다. : {}", e.getMessage());
        }

        // 썸네일 이미지들 업로드
        for (MultipartFile file : thumbnailImages) {
            try{
                s3Service.uploadFile(file, FileCategory.IMAGES, RelatedType.THUMBNAIL, courseId, thumbnailSequence++);
            } catch (IOException e){
                log.warn("S3 업로드 과정에서 문제가 발생했습니다. : {}", e.getMessage());
            }
        }
    }
}
