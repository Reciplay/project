package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.courses.dto.request.CourseSummaryCondition;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.dto.response.CourseSummary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "강좌 관리 API", description = "강좌 관리")
@RestController
@RequestMapping("/api/v1/course/courses")
@Slf4j
public class CourseApiController {

    // 분홍색 통합 API
    @GetMapping("/summary")
    @Operation(summary = "강좌 카드(요약) 정보 리스트 조회 통합 API", description = "강좌 카드(요약) 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<CourseSummary>>> getCourseSummaries(
            @ModelAttribute CourseSummaryCondition courseSummaryCondition
            ) {

        return CommonResponseBuilder.success("강좌 카드 정보 리스트 조회에 성공하였습니다.",
                List.of(new CourseSummary()));
    }


    @GetMapping("")
    @Operation(summary = "강좌 상세 정보 조회 통합 API", description = "강좌 상세 정보 조회")
    public ResponseEntity<ResponseRoot<Object>> getCourseDetail(
            @RequestParam Long courseId
    ){

        return CommonResponseBuilder.success("강좌 상세 정보 조회에 성공하였습니다.", new CourseDetail());
    }

    @PutMapping("")
    @Operation(summary = "강좌 정보 수정 API", description = "강좌 정보 수정")
    public ResponseEntity<ResponseRoot<Object>> updateCourse(
            @RequestParam Long courseId

    ){

        return CommonResponseBuilder.success("강좌 정보 수정에 성공하였습니다.", null);
    }

    @PostMapping("")
    @Operation(summary = "강좌 등록 API", description = "강좌 등록 수정")
    public ResponseEntity<ResponseRoot<Object>> createCourse(

    ){

        return CommonResponseBuilder.success("강좌 등록에 성공하였습니다.", new Object());
    }






}