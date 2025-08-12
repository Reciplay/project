package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.courses.dto.request.CourseCardCondition;
import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.dto.response.PagedResponse;
import com.e104.reciplay.course.courses.service.CourseCardQueryService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "강좌 관리 API", description = "강좌 관리")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/course/courses")
@Slf4j
public class CourseApiController {
    private final InstructorQueryService instructorQueryService;
    private final CourseQueryService courseQueryService;
    private final CourseManagementService courseManagementService;
    private final UserQueryService userQueryService;
    private final CourseCardQueryService courseCardQueryService;

    // 페이징한 결과와 페이징 하지 않은 결과를 조건문으로 두개의 결과 선택지를 줘야함(분홍색 통합 API)
    @GetMapping("/cards")
    @ApiResponse(responseCode = "200", description = "강좌 카드 정보 리스트 페이지 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @Operation(summary = "강좌 카드 정보 리스트 페이지 조회 통합 API", description = "강좌 카드 정보 리스트 페이지 조회")
    public ResponseEntity<ResponseRoot<PagedResponse<CourseCard>>> getCourseCardsPage(
            @ModelAttribute CourseCardCondition courseCardCondition,
            @PageableDefault(page = 0, size = 10, sort = "courseStartDate", direction = Sort.Direction.DESC) Pageable pageable
        ) {
        log.debug("카드 API 요청됨 ");
        log.debug("요청 데이터 {}", courseCardCondition);
        log.debug("요청 페이지 {}", pageable);
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("요청 사용자 {}", email);

        Long userId = null;
        try {
            userId = userQueryService.queryUserByEmail(email).getId();
        } catch (Exception e) {
            log.debug("존재하지 않는 이메일 입니다.");
        }
        PagedResponse<CourseCard> pagedResponse = courseCardQueryService.queryCardsByCardCondtion(courseCardCondition, pageable, userId);
        return CommonResponseBuilder.success("강좌 카드 정보 리스트 조회에 성공하였습니다.",
                pagedResponse);
    }

    // 강사의 강좌 관리 페이지에서의 강좌 상세 정보 리스트 조회 API
    @GetMapping("/list")
    @ApiResponse(responseCode = "200", description = "강좌 상세 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @Operation(summary = "강사의 강좌 관리 페이지에서의 상세 정보 리스트 조회  API", description = "강사의 강좌 관리 페이지에서의 상세 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<CourseDetail>>> getCourseCards(
            @RequestParam String courseStatus
    ) {
        String email = AuthenticationUtil.getSessionUsername();
        Long instructorId = instructorQueryService.queryInstructorIdByEmail(email);
        List<CourseDetail> courses = courseQueryService.queryCourseDetailsByInstructorId(instructorId, courseStatus);
        return CommonResponseBuilder.success("강사의 강좌 상세 정보 리스트 조회에 성공하였습니다.",
                courses);
    }


    @GetMapping("")
    @ApiResponse(responseCode = "200", description = "강좌 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강좌 상세 정보 조회  API", description = "강좌 상세 정보 조회")
    public ResponseEntity<ResponseRoot<CourseDetail>> getCourseDetail(
            @RequestParam Long courseId

    ){
        log.debug("강좌 상세 API 요청됨 ");
        log.debug("요청 데이터 {}", courseId);
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("요청 사용자 {}", email);

        Long userId = null;
        try {
            userId = userQueryService.queryUserByEmail(email).getId();
        } catch (Exception e) {
            log.debug("존재하지 않는 이메일 입니다.");
        }
        CourseDetail courseDetail = courseQueryService.queryCourseDetailByCourseId(courseId, userId);
        return CommonResponseBuilder.success("강좌 상세 정보 조회에 성공하였습니다.", courseDetail);
    }

    @PutMapping("")
    @ApiResponse(responseCode = "200", description = "강좌 상세 정보 수정 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "해당 강사가 아닌 사용자 접근")
    @Operation(summary = "강좌 정보 수정 API", description = "강좌 정보 수정")
    public ResponseEntity<ResponseRoot<CourseIdResponse>> updateCourse(
            @RequestPart RequestCourseInfo requestCourseInfo,
            @RequestPart List<MultipartFile> thumbnailImages,
            @RequestPart MultipartFile courseCoverImage

    ){
        Long courseId = courseManagementService.updateCourseByCourseId(requestCourseInfo, thumbnailImages, courseCoverImage);

        return CommonResponseBuilder.success("강좌 정보 수정에 성공하였습니다.", new CourseIdResponse(courseId));
    }

    @PostMapping("")
    @ApiResponse(responseCode = "201", description = "강좌 등록 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "해당 강사가 아닌 사용자 접근")
    @Operation(summary = "강좌 등록 API", description = "강좌 등록 수정")
    public ResponseEntity<ResponseRoot<CourseIdResponse>> createCourse(
            @RequestPart RequestCourseInfo requestCourseInfo,
            @RequestPart List<MultipartFile> thumbnailImages,
            @RequestPart MultipartFile courseCoverImage
    ){
        String email = AuthenticationUtil.getSessionUsername();
        Long instructorId = instructorQueryService.queryInstructorIdByEmail(email);

        Long courseId = courseManagementService.createCourseByInstructorId(instructorId,
                requestCourseInfo, thumbnailImages, courseCoverImage);

        return CommonResponseBuilder.success("강좌 등록에 성공하였습니다.", new CourseIdResponse(courseId));
    }
    record CourseIdResponse(Long courseId) {}
}