package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdCareerinfo;
import com.e104.reciplay.admin.dto.response.AdInstructorDetail;
import com.e104.reciplay.admin.dto.response.AdInstructorSummary;
import com.e104.reciplay.admin.dto.response.AdLicenseInfo;
import com.e104.reciplay.entity.Career;
import com.e104.reciplay.entity.InstructorLicense;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.user.instructor.service.CareerQueryService;
import com.e104.reciplay.user.instructor.service.InstructorLicenseQueryService;
import com.e104.reciplay.user.instructor.service.LicenseQueryService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdInstructorQueryServiceImplTest {

    @Mock InstructorRepository instructorRepository;
    @Mock InstructorLicenseQueryService instructorLicenseQueryService;
    @Mock CareerQueryService careerQueryService;

    // deep stubs: queryLicenseById(...).getName()
    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    LicenseQueryService licenseQueryService;

    @InjectMocks
    AdInstructorQueryServiceImpl service;

    @Nested
    @DisplayName("queryAdInstructorSummary")
    class QueryAdInstructorSummaryTests {

        @Test
        @DisplayName("isApprove == null 이면 IllegalArgumentException")
        void nullIsApproveThrows() {
            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> service.queryAdInstructorSummary(null));
            assertTrue(ex.getMessage().contains("isApprove"));
            verifyNoInteractions(instructorRepository);
        }

        @Test
        @DisplayName("정상 플로우: repo 위임 및 결과 반환")
        void delegateToRepository() {
            List<AdInstructorSummary> expected = List.of(
                    mock(AdInstructorSummary.class),
                    mock(AdInstructorSummary.class)
            );
            given(instructorRepository.findAdInstructorSummariesByIsApprove(true))
                    .willReturn(expected);

            List<AdInstructorSummary> actual = service.queryAdInstructorSummary(true);

            assertSame(expected, actual);
            verify(instructorRepository, times(1)).findAdInstructorSummariesByIsApprove(true);
        }
    }

    @Nested
    @DisplayName("queryInstructorDetail")
    class QueryInstructorDetailTests {

        @Test
        @DisplayName("강사 미존재 시 EntityNotFoundException")
        void instructorNotFoundThrows() {
            long instructorId = 100L;
            given(instructorRepository.findAdInstructorDetailByInstructorId(instructorId)).willReturn(null);

            assertThrows(EntityNotFoundException.class,
                    () -> service.queryInstructorDetail(instructorId));

            verify(instructorRepository, times(1))
                    .findAdInstructorDetailByInstructorId(instructorId);
            verifyNoInteractions(instructorLicenseQueryService, careerQueryService, licenseQueryService);
        }

        @Test
        @DisplayName("정상 플로우: 라이선스/커리어 구성 및 detail.set* 인자 검증")
        void successPopulatesDetail() {
            long instructorId = 10L;

            // detail은 setLicenses/setCareers 캡처를 위해 mock 사용
            AdInstructorDetail detail = mock(AdInstructorDetail.class);
            given(instructorRepository.findAdInstructorDetailByInstructorId(instructorId))
                    .willReturn(detail);

            // 라이선스 2개
            InstructorLicense lic1 = mock(InstructorLicense.class);
            InstructorLicense lic2 = mock(InstructorLicense.class);
            given(lic1.getLicenseId()).willReturn(1L);
            given(lic2.getLicenseId()).willReturn(2L);
            given(instructorLicenseQueryService.queryLicensesByInstructorId(instructorId))
                    .willReturn(List.of(lic1, lic2));

            // deep stub: queryLicenseById(...).getName()
            given(licenseQueryService.queryLicenseById(1L).getName()).willReturn("정보처리기사");
            given(licenseQueryService.queryLicenseById(2L).getName()).willReturn("SQLD");

            // 커리어 2개
            Career c1 = mock(Career.class);
            Career c2 = mock(Career.class);
            given(careerQueryService.queryCarrersByInstructorId(instructorId))
                    .willReturn(List.of(c1, c2));

            // 캡처
            ArgumentCaptor<List<AdLicenseInfo>> licenseListCap = ArgumentCaptor.forClass(List.class);
            ArgumentCaptor<List<AdCareerinfo>> careerListCap = ArgumentCaptor.forClass(List.class);

            // when
            AdInstructorDetail returned = service.queryInstructorDetail(instructorId);

            // then
            assertSame(detail, returned);

            verify(instructorRepository, times(1))
                    .findAdInstructorDetailByInstructorId(instructorId);
            verify(instructorLicenseQueryService, times(1))
                    .queryLicensesByInstructorId(instructorId);
            verify(careerQueryService, times(1))
                    .queryCarrersByInstructorId(instructorId);

            // 🔧 호출 횟수 검증 제거 (deep stubbing으로 인해 스텁 시점에도 1회 카운트 됨)
            // verify(licenseQueryService, times(1)).queryLicenseById(1L);
            // verify(licenseQueryService, times(1)).queryLicenseById(2L);

            verify(detail, times(1)).setLicenses(licenseListCap.capture());
            verify(detail, times(1)).setCareers(careerListCap.capture());

            List<AdLicenseInfo> licInfos = licenseListCap.getValue();
            assertNotNull(licInfos);
            assertEquals(2, licInfos.size());
            assertEquals("정보처리기사", licInfos.get(0).getName());
            assertEquals("SQLD", licInfos.get(1).getName());

            List<AdCareerinfo> careerInfos = careerListCap.getValue();
            assertNotNull(careerInfos);
            assertEquals(2, careerInfos.size());

            verifyNoMoreInteractions(instructorRepository, instructorLicenseQueryService, careerQueryService, detail);

        }
    }
}
