package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.courses.dto.request.CourseCardCondition;
import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.dto.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "강좌 관리 API", description = "강좌 관리")
@RestController
@RequestMapping("/api/v1/course/courses")
@Slf4j
public class CourseApiController {

    // 분홍색 통합 API
    // 페이징한 결과와 페이징 하지 않은 결과를 조건문으로 두개의 결과 선택지를 줘야함
    @GetMapping("/cards/page")
    @ApiResponse(responseCode = "200", description = "강좌 카드 정보 리스트 페이지 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @Operation(summary = "강좌 카드 정보 리스트 페이지 조회 통합 API", description = "강좌 카드 정보 리스트 페이지 조회")
    public ResponseEntity<ResponseRoot<PagedResponse<CourseCard>>> getCourseCardsPage(
            @ModelAttribute CourseCardCondition courseCardCondition,
            @PageableDefault(page = 0, size = 10, sort = "courseStartDate", direction = Sort.Direction.DESC) Pageable pageable
            ) {
        Page<CourseCard> page = new PageImpl<>(List.of(new CourseCard()));

        return CommonResponseBuilder.success("강좌 카드 정보 리스트 조회에 성공하였습니다.",
                new PagedResponse<>(page));
    }

    @GetMapping("/cards")
    @ApiResponse(responseCode = "200", description = "강좌 카드 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @Operation(summary = "강좌 카드 정보 리스트 조회 통합 API", description = "강좌 카드 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<CourseCard>>> getCourseCards(
            @ModelAttribute CourseCardCondition courseCardCondition
    ) {
        return CommonResponseBuilder.success("강좌 카드 정보 리스트 조회에 성공하였습니다.",
                List.of(new CourseCard()));
    }


    @GetMapping("")
    @ApiResponse(responseCode = "200", description = "강좌 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강좌 상세 정보 조회  API", description = "강좌 상세 정보 조회")
    public ResponseEntity<ResponseRoot<CourseDetail>> getCourseDetail(
            @RequestParam Long courseId
    ){

        return CommonResponseBuilder.success("강좌 상세 정보 조회에 성공하였습니다.", new CourseDetail());
    }

    @PutMapping("")
    @ApiResponse(responseCode = "200", description = "강좌 상세 정보 수정 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "해당 강사가 아닌 사용자 접근")
    @Operation(summary = "강좌 정보 수정 API", description = "강좌 정보 수정")
    public ResponseEntity<ResponseRoot<Object>> updateCourse(
            @RequestBody CourseDetail courseDetail

    ){

        return CommonResponseBuilder.success("강좌 정보 수정에 성공하였습니다.", null);
    }

    @PostMapping("")
    @ApiResponse(responseCode = "201", description = "강좌 등록 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "해당 강사가 아닌 사용자 접근")
    @Operation(summary = "강좌 등록 API", description = "강좌 등록 수정")
    public ResponseEntity<ResponseRoot<Object>> createCourse(
            @RequestBody CourseDetail courseDetail

    ){

        return CommonResponseBuilder.success("강좌 등록에 성공하였습니다.", null);
    }






}