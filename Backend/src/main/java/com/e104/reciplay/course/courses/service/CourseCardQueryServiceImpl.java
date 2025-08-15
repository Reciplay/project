package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.request.CourseCardCondition;
import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.PagedResponse;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.livekit.service.depends.CourseHistoryQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseCardQueryServiceImpl implements CourseCardQueryService{
    private final CourseRepository courseRepository;
    private final CanLearnQueryService canLearnQueryService;
    private final ReviewQueryService reviewQueryService;
    private final CategoryQueryService categoryQueryService;
    private final SubFileMetadataQueryService subFileMetadataQueryService;
    private final CourseHistoryQueryService courseHistoryQueryService;
    private final S3Service s3Service;
    private final InstructorQueryService instructorQueryService;


    @Override
    public PagedResponse<CourseCard> queryCardsByCardCondtion(CourseCardCondition condition, Pageable pageable, Long userId) {
        String cat = condition.getRequestCategory();
        if (cat == null) throw new IllegalArgumentException("requestCategory는 필수입니다.");
        log.debug("강좌 카테고리 확인 후 페이지네이션 조회");
        Page<Course> page = switch (cat) {
            case "special"     -> courseRepository.findSpecialCoursesPage(pageable);
            case "soon"        -> courseRepository.findSoonCoursesPage(pageable);
            case "search"      -> courseRepository.findsearchCoursesPage(condition.getSearchContent(), condition.getIsEnrolled(), userId, pageable);
            case "instructor"  -> courseRepository.findInstructorCoursesPage(condition.getInstructorId(), pageable);
            case "enrolled"    -> courseRepository.findEnrolledCoursesPage(userId, pageable);
            case "zzim"        -> courseRepository.findZzimCoursesPage(userId, pageable);
            case "complete"    -> courseRepository.findCompletedCoursesPage(userId, pageable);
            default            -> throw new IllegalArgumentException("지원하지 않는 requestCategory: " + cat);
        };
        // 1) 기본 필드 매핑
           List<CourseCard> cards  = new ArrayList<>();
        log.debug("강좌 카드 속성 추가");
            for(Course c : page.getContent()){
                CourseCard card = new CourseCard(c);
                log.debug("강사 id 속성 추가");
                card.setInstructorId(c.getInstructorId());
                log.debug("강사 이름 속성 추가");
                card.setInstructorName(instructorQueryService.queryNameByInstructorId(c.getInstructorId()));
                card.setCategory(categoryQueryService.queryNameByCourseId(c.getId()));
                log.debug("강좌 카테고리 속성 추가");
                card.setCanLearns(canLearnQueryService.queryContentsByCourseId(c.getId()));
                log.debug("리뷰 평균별점 속성 추가");
                card.setAverageReviewScore(reviewQueryService.avgStarsByCourseId(c.getId()));
                log.debug("해당 회원 수강 여부 속성 추가");
                card.setIsEnrolled(courseHistoryQueryService.enrolled(userId, c.getId()));

                FileMetadata fileMetadata = null;
                log.debug("카드 관련 이미지 속성 추가");
                if (cat.equals("special")) {
                    fileMetadata = subFileMetadataQueryService.queryMetadataBySequenceCondition(c.getId(), "SPECIAL_BANNER", 1);
                } else {
                    fileMetadata = subFileMetadataQueryService.queryMetadataBySequenceCondition(c.getId(), "THUMBNAIL", 1);
                }
                try {
                    card.setResponseFileInfo(s3Service.getResponseFileInfo(fileMetadata));
                } catch(Exception e) {
                    log.debug("파일 조회에 오류가 발생. 없는 파일 같아요 {}", e.getMessage());
                }
                log.debug("카드 리스트에 카드 추가");
                cards.add(card);
            }
        return PagedResponse.from(page, cards);
    }
}
