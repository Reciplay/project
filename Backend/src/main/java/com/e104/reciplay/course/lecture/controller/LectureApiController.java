package com.e104.reciplay.course.lecture.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
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

    @GetMapping("/summary/{category}")
    @Operation(summary = "강의 요약 정보 리스트 조회 API", description = "강의 요약 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<Object>>> getLectureSummaries(
            @RequestParam
    ) {

        return CommonResponseBuilder.success("강의 요약 리스트 조회에 성공하였습니다.",
                List.of(new Object()));
    }


    @GetMapping("")
    @Operation(summary = "강의 상세 정보 조회 API", description = "강의 상세 정보 조회")
    public ResponseEntity<ResponseRoot<Object>> getLectureDetail(
            @RequestParam Long lectureId
    ){

        return CommonResponseBuilder.success("강의 상세 정보 조회에 성공하였습니다.", new LectureDetail());
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
    ){

        return CommonResponseBuilder.success("강의 정보 수정에 성공하였습니다.", new Object());
    }

    @PostMapping("")
    @Operation(summary = "ToDo 리스트 생성 API", description = "ToDo 리스트 생성")
    public ResponseEntity<ResponseRoot<Object>> createTodos(
    ){
        return CommonResponseBuilder.success("ToDo 리스트 생성에 성공하였습니다.", new Object());
    }


}