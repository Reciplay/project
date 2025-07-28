package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "강사 관련 API", description = "강사에 대한 데이터를 조회하거나 강사 데이터 수정을 위한 API를 제공합니다.")
@RestController
@RequestMapping("/api/v1/user/instructor")
public class InstructorApiController {

    @GetMapping("/profile")
    public ResponseEntity<ResponseRoot<?>> getInstructorProfile(
            @RequestParam("instructorId") Long instructorId
    ) {

        return null;
    }
}
