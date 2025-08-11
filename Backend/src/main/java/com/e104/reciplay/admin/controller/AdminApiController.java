package com.e104.reciplay.admin.controller;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.admin.dto.response.*;
import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.course.lecture.dto.ChapterInfo;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.TodoInfo;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "관리자 페이지 API", description = "관리자 페이지")
@RestController
@RequestMapping("/api/v1/course/admin")
@Slf4j

public class AdminApiController{

    
    @GetMapping("/instructor/summaries")
    @ApiResponse(responseCode = "200", description = "강사 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @Operation(summary = "강사 요약 정보 리스트 조회 API", description = "강사 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdminInstructorSummary>>> getInstructorSummaries(
            @RequestParam Boolean isApprove
    ) {
        AdminInstructorSummary aS = new AdminInstructorSummary();
        aS.setInstructorId(1L);
        aS.setEmail("ssafy@naver.com");
        aS.setName("ssafy");
        aS.setRegisterdAt(LocalDateTime.now());


        return CommonResponseBuilder.success("강사 요약 정보 리스트 조회에 성공하였습니다.",
                List.of(aS));
    }

    @GetMapping("/instructor")
    @ApiResponse(responseCode = "200", description = "강사 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 강사를 찾을 수 없음")
    @Operation(summary = "강사 상세 정보 조회 API", description = "강사 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdminInstructorDetail>> getInstructorDetail(
            @RequestParam Long instructorId
    ){
        AdminInstructorDetail dummyInstructor = new AdminInstructorDetail(
                1L,                               // instructorId
                "ssafy",                            // name
                "ssafy@naver.com",                  // email
                LocalDateTime.now(),                // registeredAt
                "ssafy_nick",                       // nickName
                LocalDate.of(1995, 5, 20),           // birthDate
                LocalDateTime.now().minusYears(1),  // createdAt
                "백엔드 개발자입니다.",                  // introduction
                "서울시 강남구",                       // address
                "010-1234-5678",                     // phoneNumber
                List.of( // licenses
                        new LicenseInfo(
                                "정보처리기사",          // name
                                "한국산업인력공단",       // institution
                                "2020-06-15",          // acquisitionDate
                                "1급"                  // grade
                        ),
                        new LicenseInfo(
                                "AWS Certified Solutions Architect",
                                "Amazon",
                                "2023-02-10",
                                "Associate"
                        )
                ),
                List.of( // careers
                        new Careerinfo(
                                "삼성전자",             // companyName
                                "백엔드 개발자",         // position
                                "Spring Boot 기반 웹 서비스 개발", // jobDescription
                                LocalDate.of(2021, 1, 1), // startDate
                                LocalDate.of(2023, 12, 31) // endDate
                        ),
                        new Careerinfo(
                                "네이버",
                                "시니어 개발자",
                                "클라우드 인프라 구축 및 운영",
                                LocalDate.of(2024, 1, 1),
                                null // 현재 재직 중이면 endDate는 null
                        )
                )
        );

        return CommonResponseBuilder.success("강사 상세 정보 조회에 성공하였습니다.", dummyInstructor);
    }

    @PutMapping("/instructor")
    @ApiResponse(responseCode = "200", description = "강사 등록 수락/거절 및 알림 처리 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "처리할 강사를 찾을 수 없음")
    @Operation(summary = "강사 등록 수락/거절 및 알림 처리 API", description = "강사 등록 수락/거절 및 알림 처리 API")
    public ResponseEntity<ResponseRoot<Object>> handleIntructorRegistration(
            @RequestBody ApprovalInfo approvalInfo
    ){

        return CommonResponseBuilder.success("강사 등록 수락/거절 및 알림 처리에 성공하였습니다.", null);
    }

    @GetMapping("/course/summaries")
    @ApiResponse(responseCode = "200", description = "강좌 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @Operation(summary = "강좌 요약 정보 리스트 조회 API", description = "강좌 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdminCourseSummary>>> getCourseSummaries(
            @RequestParam Boolean isApprove
    ) {
        AdminCourseSummary summary1 = new AdminCourseSummary(
                1L,
                "홍길동",
                "Java Backend Master Class",
                LocalDateTime.of(2025, 8, 10, 14, 30)
        );
        return CommonResponseBuilder.success("강좌 요약 정보 리스트 조회에 성공하였습니다.",
                List.of(summary1));
    }

    @GetMapping("/course")
    @ApiResponse(responseCode = "200", description = "강좌 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강좌 상세 정보 조회 API", description = "강좌 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdminCourseDetail>> getCourseDetail(
            @RequestParam Long courseId
    ){
        AdminCourseDetail dummyCourse = new AdminCourseDetail(
                1L,                                      // courseId
                "Java Backend Master Class",             // courseName
                LocalDate.of(2025, 8, 20),                // courseStartDate
                LocalDate.of(2025, 9, 20),                // courseEndDate
                101L,                                     // instructorId
                LocalDate.of(2025, 8, 1),                 // enrollmentStartDate
                LocalDate.of(2025, 8, 15),                // enrollmentEndDate
                "Programming",                            // category
                "Learn advanced backend development",     // summary
                30,                                       // maxEnrollments
                true,                                     // isEnrollment
                2,                                        // level
                "첫 수업은 8월 20일에 시작합니다.",            // announcement
                "이 강좌는 Java Spring Boot 기반 백엔드 개발 심화 과정입니다.", // description
                List.of( // lectureDetails
                        new LectureDetail(
                                1L,
                                1,
                                "Spring Boot Basics",
                                "Spring Boot 기본 개념 학습",
                                "돼지고기 300g/파 2대/양파 3개/토마토 반개/간장 40cc",
                                false,
                                LocalDateTime.now(),
                                LocalDateTime.now(),
                                List.of(new ChapterInfo(1, "챕터1", List.of(new TodoInfo(1L, 1, "투두 1", TodoType.NORMAL, 0)))),
                                new ResponseFileInfo("test.url", "강의자료1.pdf", 1),true
                        ),
                        new LectureDetail(
                                2L,
                                2,
                                "Spring Boot Advance",
                                "Spring Boot 기본 개념 학습",
                                "돼지고기 300g/파 2대/양파 3개/토마토 반개/간장 40cc",
                                false,
                                LocalDateTime.now(),
                                LocalDateTime.now(),
                                List.of(new ChapterInfo(1, "챕터1", List.of(new TodoInfo(2L, 1, "투두 1", TodoType.NORMAL, 0)))),
                                new ResponseFileInfo("test.url", "강의자료1.pdf", 1),true
                        )
                )
        );
        return CommonResponseBuilder.success("강좌 상세 정보 조회에 성공하였습니다.", dummyCourse);
    }

    @PutMapping("/course")
    @ApiResponse(responseCode = "200", description = "강좌 등록 수락/거절 및 알림 처리 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "처리할 강좌를 찾을 수 없음")
    @Operation(summary = "강좌 등록 수락/거절 및 알림 처리 API", description = "강좌 등록 수락/거절 및 알림 처리")
    public ResponseEntity<ResponseRoot<Object>> handleCourseRegistration(
            @RequestBody ApprovalInfo approvalInfo
    ){

        return CommonResponseBuilder.success("강좌 등록 수락/거절 및 알림 처리에 성공하였습니다.", null);
    }

    @GetMapping("/user/summaries")
    @ApiResponse(responseCode = "200", description = "일반 회원 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @Operation(summary = "일반 회원 요약 정보 리스트 조회 API", description = "일반 회원 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdminUserSummary>>> getUserSummaries(
    ) {
        AdminUserSummary dummyUser = new AdminUserSummary(
                1L,                         // userId
                "홍길동",                     // name
                "honggildong@example.com",  // email
                LocalDateTime.of(2025, 8, 10, 14, 30, 0) // createdAt
        );

        return CommonResponseBuilder.success("일반 회원 요약 정보 리스트 조회에 성공하였습니다.",
                List.of(dummyUser));
    }

    @GetMapping("/user")
    @ApiResponse(responseCode = "200", description = "일반 회원 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 회원을 찾을 수 없음")
    @Operation(summary = "일반 회원 상세 정보 조회 API", description = "일반 회원 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdminUserDetail>> getUserDetail(
            @RequestParam Long userId
    ){
        AdminUserDetail dummyUser = new AdminUserDetail(
                1L,
                "홍길동",
                "honggildong@example.com",
                LocalDateTime.of(2025, 8, 10, 14, 30, 0), // java.time LocalDateTime
                true,
                "백엔드 개발자",
                "길동이",
                "1990-05-20"
        );



        return CommonResponseBuilder.success("일반 회원 상세 정보 조회에 성공하였습니다.", dummyUser);
    }

    @DeleteMapping("/user")
    @ApiResponse(responseCode = "200", description = "회원 탈퇴 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 회원을 찾을 수 없음")
    @Operation(summary = "회원 탈퇴 API", description = "회원 탈퇴")
    public ResponseEntity<ResponseRoot<Object>> DeleteUser(
            @RequestParam Long userId
    ){

        return CommonResponseBuilder.success("회원 탈퇴에 성공하였습니다.", null);
    }
}