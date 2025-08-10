package com.e104.reciplay.course.lecture.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;

import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.response.ChapterInfo;
import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import com.e104.reciplay.course.lecture.dto.response.TodoInfo;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import com.e104.reciplay.course.lecture.dto.response.response.CourseTerm;
import com.e104.reciplay.course.lecture.service.LectureManagementService;
import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "강의 관리 API", description = "강의 관리")
@RestController
@RequestMapping("/api/v1/course/lecture")
@Slf4j
@RequiredArgsConstructor
public class LectureApiController {
    private final LectureQueryService lectureQueryService;
    private final LectureManagementService lectureManagementService;
    private final CourseManagementService courseManagementService;

    @GetMapping("/summaries")
    @ApiResponse(responseCode = "200", description = "강의 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강의 요약 정보 리스트 조회 API", description = "강의 요약 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<LectureSummary>>> getLectureSummaries(
            @RequestParam Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.debug("강의 요약 정보 리스트 조회 요청 데이터 = {}", courseId);
        log.debug("강의 요약 정보 리스트 조회 요청 사용자 = {}", userDetails);

        //////////////////////////////////////////////////////////////////
        List<LectureSummary> summaries = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            summaries.add(
                    new LectureSummary(i + 1, 1L, "제목", LocalDateTime.now().plusMonths(i), false));
        }

        //////////////////////////////////////////////////////////////////
        return CommonResponseBuilder.success("강의 요약 정보 리스트 조회에 성공하였습니다.",
                summaries);
    }


    @GetMapping("")
    @ApiResponse(responseCode = "200", description = "강의 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강의를 찾을 수 없음")
    @Operation(summary = "강의 상세 정보 조회 API", description = "강의 상세 정보 조회")
    public ResponseEntity<ResponseRoot<LectureDetail>> getLectureDetail(
            @RequestParam Long lectureId
    ) {
        LectureDetail detail = new LectureDetail(1L, 1, "제목", "소개", "www.test.com", false, "자료1.pdf", LocalDateTime.now().plusMonths(1), LocalDateTime.now().plusHours(2).plusMonths(1),
                List.of(
                        new ChapterInfo(1, "챔터1", List.of(
                                new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                        )),
                        new ChapterInfo(2, "챔터2", List.of(
                                new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                        ))
                )
        );
        return CommonResponseBuilder.success("강의 상세 정보 조회에 성공하였습니다.", detail);
    }


    @GetMapping("list")
    @ApiResponse(responseCode = "200", description = "강의 상세 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강의 상세 정보 리스트 조회 API", description = "강의 상세 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<LectureDetail>>> getLectureDetails(
            @RequestParam Long courseId
    ) {
        ////////////////////////////////////////////////////////////////////////////////////
        List<LectureDetail> details = List.of(new LectureDetail(1L, 1, "제목1", "소개", "www.test.com", false, "자료1.pdf", LocalDateTime.now().plusMonths(1), LocalDateTime.now().plusHours(2).plusMonths(1),
                List.of(
                                new ChapterInfo(1, "챔터1", List.of(
                                        new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                        new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                        new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                                )),
                                new ChapterInfo(2, "챔터2", List.of(
                                        new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                        new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                        new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                                ))
                        )
                ),new LectureDetail(2L, 2, "제목2", "소개", "www.test.com", true, "자료1.pdf", LocalDateTime.now().plusMonths(2), LocalDateTime.now().plusHours(2).plusMonths(2),
                        List.of(
                                new ChapterInfo(1, "챔터1", List.of(
                                        new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                        new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                        new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                                )),
                                new ChapterInfo(2, "챔터2", List.of(
                                        new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                        new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                        new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                                ))
                        )
                ),new LectureDetail(3L, 3, "제목3", "소개", "www.test.com", false, "자료1.pdf", LocalDateTime.now().plusMonths(3), LocalDateTime.now().plusHours(2).plusMonths(3),
                        List.of(
                                new ChapterInfo(1, "챔터1", List.of(
                                        new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                        new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                        new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                                )),
                                new ChapterInfo(2, "챔터2", List.of(
                                        new TodoInfo(1, "Todo 1", TodoType.NORMAL, 0),
                                        new TodoInfo(2, "Todo 2", TodoType.NORMAL, 0),
                                        new TodoInfo(3, "Todo 3", TodoType.TIMER, 300)
                                ))
                        )
                ));
        ///////////////////////////////////////////////////////////////////////////////////
        return CommonResponseBuilder.success("강의 상세 정보 리스트 조회에 성공하였습니다.", details);
    }


    @PatchMapping("/skip")
    @ApiResponse(responseCode = "200", description = "강의 휴강 상태 변경 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "변경할 강의를 찾을 수 없음")
    @Operation(summary = "강의 휴강 상태 변경 API", description = "강의 휴강 상태 변경")
    public ResponseEntity<ResponseRoot<Object>> updateSkipStatus(
            @RequestParam Long lectureId,
            @RequestParam Boolean isSkipped
    ) {
        lectureManagementService.updateSkipStatus(lectureId, isSkipped);

        return CommonResponseBuilder.success("강의 휴강 상태 변경에 성공하였습니다.", null);
    }


    @PutMapping("")
    @ApiResponse(responseCode = "200", description = "강의 정보 수정 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "수정할 강의를 찾을 수 없음")
    @Operation(summary = "강의 정보 수정 API", description = "강의 정보 수정")
    public ResponseEntity<ResponseRoot<Object>> updateLecture(
            @RequestBody LectureDetail lectureDetail
    ) {
        lectureManagementService.updateLecture(lectureDetail);
        return CommonResponseBuilder.success("강의 정보 수정에 성공하였습니다.", null);
    }


    @PostMapping("")
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
    ) {
        log.info("lectureRequests: {}", lectureRequests);
        // 우선, 파일과 강의 정보를 묶어야 한다.
        List<LectureRegisterRequest> requests = lectureManagementService.groupLectureAndMaterial(lectureRequests, multipartRequest);
        CourseTerm term = lectureManagementService.registerLectures(requests, courseId);
        courseManagementService.setCourseTerm(term, courseId);

        return CommonResponseBuilder.success("강의 등록에 성공했습니다.", null);
    }
}