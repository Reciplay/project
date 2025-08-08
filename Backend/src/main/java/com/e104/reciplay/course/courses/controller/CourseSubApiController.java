package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import com.e104.reciplay.course.lecture.dto.response.response.CourseTerm;
import com.e104.reciplay.course.lecture.service.LectureManagementService;
import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.Iterator;
import java.util.List;

@Tag(name = "강좌의 강의 등록 컨트롤러", description = "강좌 등록에서 분리됨.")
@RestController
@RequestMapping("/api/v1/course/courses")
@RequiredArgsConstructor
@Slf4j
public class CourseSubApiController {
    private final LectureManagementService lectureManagementService;
    private final CourseManagementService courseManagementService;

    @PostMapping("/lectures")
    @Operation(summary = "강의 정보 업로드", description = """
            주의하실 점: 전송시 multipart/form-data 타입으로 전송합니다.
            또, 각 강의 자료는 강의의 순서 값을 part name에 달아서
            material/번호 로 전송합니다.
            번호는 0번부터 시작합니다.
            
            lecture들은 모두 하나의 json 배열에 담아서 lecture라는 part name으로 전송합니다.
            """)
    @ApiResponse(responseCode = "200", description = "강의 등록 성공")
    @ApiResponse(responseCode = "400", description = "강의 등록 실패")
    public ResponseEntity<?> recieveComplexLectures(
            @RequestParam("courseId") Long courseId,
            @RequestPart("lecture") List<LectureRequest> lectureRequests,
            MultipartHttpServletRequest multipartRequest
    )  {
        log.info("lectureRequests: {}", lectureRequests);
        // 우선, 파일과 강의 정보를 묶어야 한다.
        List<LectureRegisterRequest> requests = lectureManagementService.groupLectureAndMaterial(lectureRequests, multipartRequest);
        CourseTerm term = lectureManagementService.registerLectures(requests, courseId);
        courseManagementService.setCourseTerm(term, courseId);

        return CommonResponseBuilder.success("강의 등록에 성공했습니다.", null);
    }
}
