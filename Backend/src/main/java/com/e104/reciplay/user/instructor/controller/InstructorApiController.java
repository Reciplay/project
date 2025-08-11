package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
<<<<<<< HEAD
import com.e104.reciplay.user.instructor.service.InstructorManagementService;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
=======
import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import com.e104.reciplay.user.instructor.dto.response.item.QnaDetail;
import com.e104.reciplay.user.instructor.dto.response.item.SubscriberHistory;
>>>>>>> dev
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "강사 관련 API", description = "강사에 대한 데이터를 조회하거나 강사 데이터 수정을 위한 API를 제공합니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user/instructor")
public class InstructorApiController {

    private final UserQueryService userQueryService;
    private final InstructorManagementService instructorManagementService;
    private final InstructorQueryService instructorQueryService;

    @GetMapping("/profile")
    @Operation(summary = "강사 소개 조회 API", description = "강사 명, 프로필 이미지, 커버 이미지 등을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 소개 정보 조회에 성공함.")
    @ApiResponse(responseCode = "400", description = "없는 강사에 대한 조회 시도.")
    public ResponseEntity<ResponseRoot<InstructorProfile>> getInstructorProfile(
            @RequestParam("instructorId") Long instructorId
    ) {
<<<<<<< HEAD
        String email = AuthenticationUtil.getSessionUsername();
        Long userId = userQueryService.queryUserByEmail(email).getId();
        InstructorProfile instructorProfile = instructorQueryService.queryInstructorProfile(instructorId, userId);
        return CommonResponseBuilder.success("강사 정보 조회에 성공했습니다.", instructorProfile);
=======
        InstructorProfile dummyProfile = new InstructorProfile(
                "홍길동",                              // name
                "https://example.com/profile.jpg",    // profileImage
                "https://example.com/cover.jpg",      // coverImage
                "백엔드 및 클라우드 아키텍처 전문가",     // introduction
                List.of( // licenses
                        new LicenseItem(
                                1L,
                                "정보처리기사",
                                "한국산업인력공단",
                                LocalDate.of(2020, 6, 15),
                                1
                        ),
                        new LicenseItem(
                                2L,
                                "AWS Certified Solutions Architect",
                                "Amazon",
                                LocalDate.of(2023, 2, 10),
                                0
                        )
                ),
                List.of( // careers
                        new CareerItem(
                                1L,
                                "삼성전자",
                                "백엔드 개발자",
                                "Spring Boot 기반 대규모 서비스 개발",
                                LocalDate.of(2021, 1, 1),
                                LocalDate.of(2023, 12, 31)
                        ),
                        new CareerItem(
                                2L,
                                "네이버",
                                "시니어 개발자",
                                "클라우드 인프라 구축 및 운영",
                                LocalDate.of(2024, 1, 1),
                                null // 현재 재직 중
                        )
                ),
                1500,  // subscriberCount
                true   // isSubscribed
        );
        return CommonResponseBuilder.success("강사 정보 조회에 성공했습니다.", dummyProfile);
>>>>>>> dev
    }

    @PutMapping("/profile")
    @Operation(summary = "강사 정보 수정 API", description = "강사가 자신의 정보를 수정합니다.")
    @ApiResponse(responseCode = "200", description = "강사 정보 수정 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "400", description = "강사 정보 오류")
    public ResponseEntity<ResponseRoot<Object>> updateInstructorProfile(
            @RequestPart("coverImage") MultipartFile instructorBannerImage,
            @RequestPart("profileInfo") InstructorProfileUpdateRequest request
            ) {
        String email = AuthenticationUtil.getSessionUsername();
        Long instructorId = instructorQueryService.queryInstructorIdByEmail(email);
        instructorManagementService.updateInstructor(instructorId, request, instructorBannerImage);

        return CommonResponseBuilder.success("강사 정보 수정에 성공했습니다.", null);
    }

<<<<<<< HEAD
=======
    @GetMapping("/statistic")
    @Operation(summary = "강사  통계 정보 조회 API", description = "강사의  통계 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 통계 정보 조회 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    public ResponseEntity<ResponseRoot<InstructorStat>> getInstructorStatistic(
    ) {
//        String email = AuthenticationUtil.getSessionUsername();
//        Long instructorId = instructorQueryService.queryInstructorIdByEmail(email);
//        instructorQueryService.queryInstructorStatistic(instructorId);
        InstructorStat dummyStat = new InstructorStat(
                150,                                   // totalStudents
                4.7,                                   // averageStars
                35,                                    // tatalReviewCount
                220,                                   // subscriberCount
                "https://example.com/profile.jpg",     // profileImageUrl
                List.of( // newQuestions
                        new QnaDetail(
                                1L,
                                "Spring Boot JPA 설정 방법",
                                "Spring Boot 프로젝트에서 JPA 설정 시 주의할 점은 무엇인가요?",
                                LocalDateTime.of(2025, 8, 10, 14, 30),
                                "Java Backend Master Class",
                                101L
                        ),
                        new QnaDetail(
                                2L,
                                "AWS EC2 배포 관련 질문",
                                "AWS EC2 배포 시 보안 그룹 설정은 어떻게 해야 하나요?",
                                LocalDateTime.of(2025, 8, 9, 10, 0),
                                "Cloud Deployment Basics",
                                102L
                        )
                )
        );



        return CommonResponseBuilder.success("강사 통계 정보 조회에 성공했습니다.", dummyStat);
    }

>>>>>>> dev
    @PostMapping("")
    @Operation(summary = "강사 등록 API", description = "강사 등록을 수행한다. 관리자가 수락하기 전까진 is_approved 값이 false이다.")
    @ApiResponse(responseCode = "201", description = "강사 등록 신청에 성공함.")
    @ApiResponse(responseCode = "400", description = "이미 강사로 등록된 사용자가 시도")
    public ResponseEntity<ResponseRoot<Object>> applyForInstructorRole(
            @RequestPart("coverImage") MultipartFile instructorBannerImage,
            @RequestPart("instructorProfile") InstructorApplicationRequest request
    ) {
        String email = AuthenticationUtil.getSessionUsername();
        Long userId = userQueryService.queryUserByEmail(email).getId();
        instructorManagementService.registerInstructor(userId, request, instructorBannerImage);

        return CommonResponseBuilder.success("강사 등록 신청에 성공했습니다.", null);
    }

<<<<<<< HEAD
    @GetMapping("/statistic")
    @Operation(summary = "강사  통계 정보 조회 API", description = "강사의  통계 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 통계 정보 조회 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    public ResponseEntity<ResponseRoot<InstructorStat>> getInstructorStatistic(
    ) {
        String email = AuthenticationUtil.getSessionUsername();
        Long instructorId = instructorQueryService.queryInstructorIdByEmail(email);
        InstructorStat instructorStat = instructorQueryService.queryInstructorStatistic(instructorId);
        return CommonResponseBuilder.success("강사 통계 정보 조회에 성공했습니다.", instructorStat);
    }

    //    @GetMapping("/subscription")
//    @Operation(summary = "강사 통계 정보 조회 API", description = "강사의 통계 정보를 조회합니다.")
//    @ApiResponse(responseCode = "200", description = "강사 통계 정보 조회 성공")
//    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
//    public ResponseEntity<ResponseRoot<InstructorStat>> getInstructorStatistic(
//            @RequestParam("criteris") String subscriberChartCriteria
//    ) {
//
//
//        return CommonResponseBuilder.success("강사 통계 정보 조회에 성공했습니다.", new InstructorStat());
//    }
=======
        @GetMapping("/subscription")
    @Operation(summary = "강사 통계 정보 조회 API", description = "강사의 통계 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 통계 정보 조회 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    public ResponseEntity<ResponseRoot<List<SubscriberHistory>>> getInstructorStatistic(
            @RequestParam("criteris") String subscriberChartCriteria
    ) {
            List<SubscriberHistory> subscriberHistories = List.of(
                    new SubscriberHistory(LocalDate.of(2025, 8, 1), 120),
                    new SubscriberHistory(LocalDate.of(2025, 8, 2), 125),
                    new SubscriberHistory(LocalDate.of(2025, 8, 3), 130),
                    new SubscriberHistory(LocalDate.of(2025, 8, 4), 140),
                    new SubscriberHistory(LocalDate.of(2025, 8, 5), 150)
            );


        return CommonResponseBuilder.success("강사 통계 정보 조회에 성공했습니다.",subscriberHistories);
    }

>>>>>>> dev

}



