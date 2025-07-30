package com.e104.reciplay.course.enrollment.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "수강 신청 관리 API", description = "수강 신청 관리")
@RestController
@RequestMapping("/api/v1/course/enrollment")
@Slf4j

public class EnrollmentApiController{
    @PostMapping("")
    @Operation(summary = "수강 신청 등록 API", description = "수강 신청 등록")
    public ResponseEntity<ResponseRoot<Object>> createEnrollment(
            @RequestParam Long courseId
    ){

        return CommonResponseBuilder.success("수강 신청 등록에 성공하였습니다.",
                null);
    }

    @DeleteMapping("")
    @Operation(summary = "수강 신청 삭제 API", description = "수강 신청 삭제")
    public ResponseEntity<ResponseRoot<Object>> deleteEnrollment(
            @RequestParam Long courseId
    ){

        return CommonResponseBuilder.success("수강 신청 삭제에 성공하였습니다.",
                null);
    }

}