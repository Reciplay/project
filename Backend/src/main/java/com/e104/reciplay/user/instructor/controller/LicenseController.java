package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.instructor.dto.request.LicenseSummary;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "자격증 조회용 API", description = "자격증 정보를 조회할 수 있는 API")
@RestController
@RequestMapping("/api/v1/user/license")
public class LicenseController {

    @GetMapping("/list")
    @Operation(summary = "자격증 목록 조회 API", description = "자격증 목록을 조회합니다..")
    @ApiResponse(responseCode = "200", description = "자격증 목록 조회 성공")
    public ResponseEntity<ResponseRoot<List<LicenseSummary>>> getLicenseList() {

        return CommonResponseBuilder.success("자격증 목록 조회에 성공했습니다.", List.of(new LicenseSummary()));
    }
}
