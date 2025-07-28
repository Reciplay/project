package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import retrofit2.http.Multipart;

@Tag(name = "강사 관련 API", description = "강사에 대한 데이터를 조회하거나 강사 데이터 수정을 위한 API를 제공합니다.")
@RestController
@RequestMapping("/api/v1/user/instructor")
public class InstructorApiController {

    @GetMapping("/profile")
    @Operation(summary = "강사 소개 조회 API", description = "강사 명, 프로필 이미지, 커버 이미지 등을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 소개 정보 조회에 성공함.")
    @ApiResponse(responseCode = "400", description = "없는 강사에 대한 조회 시도시.")
    public ResponseEntity<ResponseRoot<InstructorProfile>> getInstructorProfile(
            @RequestParam("instructorId") Long instructorId
    ) {

        return CommonResponseBuilder.success("강사 정보 조회에 성공했습니다.", new InstructorProfile());
    }

    @PutMapping("/profile")
    @Operation(summary = "강사 정보 수정 API", description = "강사가 자신의 정보를 수정합니다.")
    @ApiResponse(responseCode = "200", description = "강사 정보 수정 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "400", description = "강사 정보 오류")
    public ResponseEntity<ResponseRoot<Object>> updateInstructorProfile(
            @RequestPart("coverImage") MultipartFile coverImage,
            @RequestPart("profileInfo") InstructorProfileUpdateRequest request
            ) {


        return CommonResponseBuilder.success("강사 정보 수정에 성공했습니다.", null);
    }

    @GetMapping("/statistic")
    @Operation(summary = "강사 통계 정보 조회 API", description = "강사의 통계 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 통계 정보 조회 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    public ResponseEntity<ResponseRoot<InstructorStat>> getInstructorStatistic(
            @RequestParam("criteris") String subscriberChartCriteria
    ) {


        return CommonResponseBuilder.success("강사 통계 정보 조회에 성공했습니다.", new InstructorStat());
    }

    @PostMapping("")
    @Operation(summary = "강사 등록 API", description = "강사 등록을 수행한다. 관리자가 수락하기 전까진 is_approved 값이 false이다.")
    @ApiResponse(responseCode = "201", description = "강사 등록 신청에 성공함.")
    @ApiResponse(responseCode = "400", description = "이미 강사로 등록된 사용자가 시도")
    public ResponseEntity<ResponseRoot<Object>> applyForInstructorRole(
            @RequestPart("coverImage") MultipartFile coverImage,
            @RequestPart("instructorProfile") InstructorApplicationRequest request
    ) {


        return CommonResponseBuilder.success("강사 등록 신청에 성공했습니다.", null);
    }
}
