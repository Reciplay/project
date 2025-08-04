package com.e104.reciplay.course.lecture.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "강의 관리 API", description = "강의 관리")
@RestController
@RequestMapping("/api/v1/course/lecture")
@Slf4j

public class LectureApiController{

    @GetMapping("/summaries")
    @ApiResponse(responseCode = "200", description = "강의 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강의 요약 정보 리스트 조회 API", description = "강의 요약 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<LectureSummary>>> getLectureSummaries(
            @RequestParam Long courseId
            ) {

        return CommonResponseBuilder.success("강의 요약 정보 리스트 조회에 성공하였습니다.",
                List.of(new LectureSummary()));
    }


    @GetMapping("")
    @ApiResponse(responseCode = "200", description = "강의 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강의를 찾을 수 없음")
    @Operation(summary = "강의 상세 정보 조회 API", description = "강의 상세 정보 조회")
    public ResponseEntity<ResponseRoot<LectureDetail>> getLectureDetail(
            @RequestParam Long lectureId
    ){

        return CommonResponseBuilder.success("강의 상세 정보 조회에 성공하였습니다.", new LectureDetail());
    }
    @GetMapping("list")
    @ApiResponse(responseCode = "200", description = "강의 상세 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강의 상세 정보 리스트 조회 API", description = "강의 상세 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<LectureDetail>>> getLectureDetails(
            @RequestParam Long courseId
    ) {

        return CommonResponseBuilder.success("강의 요약 리스트 조회에 성공하였습니다.",
                List.of(new LectureDetail()));
    }

    @PatchMapping("/skip")
    @ApiResponse(responseCode = "200", description = "강의 휴강 상태 변경 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "변경할 강의를 찾을 수 없음")
    @Operation(summary = "강의 휴강 상태 변경 API", description = "강의 휴강 상태 변경")
    public ResponseEntity<ResponseRoot<Object>> updateSkipStatus(
            @RequestParam Long lectureId,
            @RequestParam Boolean isSkipped
    ){

        return CommonResponseBuilder.success("강의 휴강 상태 변경에 성공하였습니다.", null);
    }

    @PutMapping("")
    @ApiResponse(responseCode = "200", description = "강의 정보 수정 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "수정할 강의를 찾을 수 없음")
    @Operation(summary = "강의 정보 수정 API", description = "강의 정보 수정")
    public ResponseEntity<ResponseRoot<Object>> updateLecture(
            @RequestBody LectureDetail lectureDetail
            ){

        return CommonResponseBuilder.success("강의 정보 수정에 성공하였습니다.", null);
    }



}