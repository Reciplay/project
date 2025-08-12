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

            for(Course c : page.getContent()){
                CourseCard card = new CourseCard(c);
                card.setInstructorId(c.getInstructorId());
                card.setInstructorName(instructorQueryService.queryNameByInstructorId(c.getInstructorId()));
                card.setCategory(categoryQueryService.queryNameByCourseId(c.getId()));
                card.setCanLearns(canLearnQueryService.queryContentsByCourseId(c.getId()));
                card.setAverageReviewScore(reviewQueryService.avgStarsByCourseId(c.getId()));
                card.setIsEnrolled(courseHistoryQueryService.enrolled(userId, c.getId()));

                FileMetadata fileMetadata = null;
                if (cat.equals("special")) {
                        fileMetadata = subFileMetadataQueryService.queryMetadataByCondition(c.getId(), "COURSE_COVER");
                } else {
                    fileMetadata = subFileMetadataQueryService.queryMetadataByCondition(c.getId(), "THUMBNAIL");
                }

                card.setResponseFileInfo(s3Service.getResponseFileInfo(fileMetadata));
                cards.add(card);
            }
        return PagedResponse.from(page, cards);
    }
}
