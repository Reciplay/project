package com.e104.reciplay.course.lecture.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.request.LectureUpdateInfo;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import io.swagger.v3.oas.annotations.Operation;
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

    @GetMapping("/summary")
    @Operation(summary = "강의 요약 정보 리스트 조회 API", description = "강의 요약 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<LectureSummary>>> getLectureSummaries(
    ) {

        return CommonResponseBuilder.success("강의 요약 리스트 조회에 성공하였습니다.",
                List.of(new LectureSummary()));
    }


    @GetMapping("")
    @Operation(summary = "강의 상세 정보 조회 API", description = "강의 상세 정보 조회")
    public ResponseEntity<ResponseRoot<LectureDetail>> getLectureDetail(
            @RequestParam Long lectureId
    ){

        return CommonResponseBuilder.success("강의 상세 정보 조회에 성공하였습니다.", new LectureDetail());
    }
    @GetMapping("/")
    @Operation(summary = "강의 상세 정보 리스트 조회 API", description = "강의 상세 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<LectureDetail>>> getLectureDetails(
    ) {

        return CommonResponseBuilder.success("강의 요약 리스트 조회에 성공하였습니다.",
                List.of(new LectureDetail()));
    }

    @PatchMapping("/skip")
    @Operation(summary = "강의 휴강 상태 변경 API", description = "강의 휴강 상태 변경")
    public ResponseEntity<ResponseRoot<Object>> updateSkipStatus(
            @RequestParam Long lectureId,
            @RequestParam Integer isSkpied
    ){

        return CommonResponseBuilder.success("강의 휴강 상태 변경에 성공하였습니다.", null);
    }

    @PutMapping("")
    @Operation(summary = "강의 정보 수정 API", description = "강의 정보 수정")
    public ResponseEntity<ResponseRoot<Object>> updateLecture(
            @RequestBody LectureUpdateInfo lectureUpdateInfo
            ){

        return CommonResponseBuilder.success("강의 정보 수정에 성공하였습니다.", null);
    }



}