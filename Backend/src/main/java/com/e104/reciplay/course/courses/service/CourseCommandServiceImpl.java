package com.e104.reciplay.course.courses.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseCommandServiceImpl implements CourseCommandService{

//    private final CourseRepository courseRepository;
//    private final ChapterRepository chapterRepository;
//    private final TodoRepository todoRepository;
//    @Override
//    public void creatCourseByInstructorId(Long instructorId, CourseRegisterInfo courseRegisterInfo) {
//        LocalDate nowDate = LocalDate.now();
//        // 파일 처리 해야됨
//        Course course = Course.builder()
//                .instructorId(instructorId)
//                .title(courseRegisterInfo.getTitle())
//                .summary(courseRegisterInfo.getSummary())
//                .description(courseRegisterInfo.getDescription())
//                .level(courseRegisterInfo.getLevel())
//                .categoryId(null) // 수정 필요
//                .maxEnrollments(courseRegisterInfo.getMaxEnrollments())
//                .enrollmentStartDate(courseRegisterInfo.getEnrollmentStartDate())
//                .enrollmentEndDate(courseRegisterInfo.getEnrollmentEndDate())
//                .courseStartDate(nowDate) // 수정 필요
//                .courseEndDate(nowDate) // 수정 필요
//                .announcement(courseRegisterInfo.getAnnouncement())
//                .isLive(false)
//                .isApproved(false)
//                .isDeleted(false)
//                .currentEnrollments(0) // 수정 필요
//                .registeredAt(LocalDateTime.now())
//                .build();
//
//        courseRepository.save(course);
//
//        // 2. Chapter 및 Todo 저장
//        for (ChapterInfo chapterInfo : courseRegisterInfo.getChapters()) {
//            Chapter chapter = Chapter.builder()
//                    .lectureId(course.getId()) // Course의 ID가 필요하다면 courseId -> lectureId 수정 필요
//                    .sequence(chapterInfo.getSequence())
//                    .title(chapterInfo.getTitle())
//                    .build();
//            chapterRepository.save(chapter);
//
//            for (TodoInfo todoInfo : chapterInfo.getTodos()) {
//                Todo todo = Todo.builder()
//                        .chapterId(chapter.getId())
//                        .sequence(todoInfo.getSequence())
//                        .title(todoInfo.getTitle())
//                        .type(todoInfo.getType())
//                        .seconds(todoInfo.getSeconds())
//                        .build();
//                todoRepository.save(todo);
//            }
//        }
//    }

}
