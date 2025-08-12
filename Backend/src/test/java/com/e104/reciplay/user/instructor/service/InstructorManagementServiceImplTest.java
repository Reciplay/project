package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.Career;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.entity.InstructorLicense;
import com.e104.reciplay.entity.License;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstructorManagementServiceImplTest {

    @Mock private S3Service s3Service;
    @Mock private InstructorRepository instructorRepository;
    @Mock private InstructorLicenseManagementService instructorLicenseManagementService;
    @Mock private CareerManagementService careerManagementService;
    @Mock private LicenseQueryService licenseQueryService;
    @Mock private InstructorQueryService instructorQueryService;

    @InjectMocks
    private InstructorManagementServiceImpl service;

    private MultipartFile banner() {
        return new MockMultipartFile("coverImage", "banner.png", "image/png", "bin".getBytes());
    }

    private LicenseItem licItem(Long id, String institution, LocalDate acq, String grade) {
        // 서비스 코드가 getLicneseId(오타)를 호출하므로 주의!
        LicenseItem item = mock(LicenseItem.class);
        when(item.getLicenseId()).thenReturn(id);

        // 경로에 따라 안 쓰일 수 있는 스텁 → lenient 처리
        lenient().when(item.getInstitution()).thenReturn(institution);
        lenient().when(item.getAcquisitionDate()).thenReturn(acq);
        lenient().when(item.getGrade()).thenReturn(grade);
        return item;
    }

    private CareerItem careerItem(String companyName) {
        CareerItem item = mock(CareerItem.class);
        when(item.getCompanyName()).thenReturn(companyName);
        return item;
    }

    @Nested
    class RegisterInstructor {

        @Test
        @DisplayName("registerInstructor: 저장 후 공통정보 생성(배너 업로드, 유효 라이선스/커리어 저장)")
        void register_ok() throws Exception {
            Long userId = 11L;

            InstructorApplicationRequest req = mock(InstructorApplicationRequest.class);
            LicenseItem licValid = licItem(1L, "기관", LocalDate.of(2020,1,1), "1급");
            LicenseItem licSkipNullId = licItem(null, "기관", LocalDate.of(2020,1,1), "1급"); // 스킵

            License licenseEntity = mock(License.class);
            when(licenseQueryService.queryLicenseById(1L)).thenReturn(licenseEntity);

            CareerItem cValid = careerItem("회사A");
            CareerItem cSkipBlank = careerItem("   "); // 스킵

            when(req.getLicenses()).thenReturn(List.of(licValid, licSkipNullId));
            when(req.getCareers()).thenReturn(List.of(cValid, cSkipBlank));

            when(instructorRepository.save(any(Instructor.class))).thenAnswer(inv -> {
                Instructor i = inv.getArgument(0);
                i.setId(100L);
                return i;
            });

            assertThatCode(() -> service.registerInstructor(userId, req, banner()))
                    .doesNotThrowAnyException();

            verify(s3Service).uploadFile(any(MultipartFile.class),
                    eq(FileCategory.IMAGES), eq(RelatedType.INSTRUCTOR_BANNER), eq(100L), eq(1));

            ArgumentCaptor<InstructorLicense> licCaptor = ArgumentCaptor.forClass(InstructorLicense.class);
            verify(instructorLicenseManagementService, times(1)).saveInstructorLicense(licCaptor.capture());
            InstructorLicense savedLic = licCaptor.getValue();
            assert savedLic.getInstructorId().equals(100L);

            verify(careerManagementService, times(1)).saveCareer(any(Career.class));
            verify(instructorRepository).save(any(Instructor.class));
        }

        @Test
        @DisplayName("registerInstructor: 배너 업로드 IOException 발생해도 나머지는 진행")
        void register_bannerIOException() throws Exception {
            InstructorApplicationRequest req = mock(InstructorApplicationRequest.class);
            when(req.getLicenses()).thenReturn(List.of());
            when(req.getCareers()).thenReturn(List.of());

            when(instructorRepository.save(any(Instructor.class))).thenAnswer(inv -> {
                Instructor i = inv.getArgument(0);
                i.setId(200L);
                return i;
            });

            doThrow(new IOException("fail")).when(s3Service)
                    .uploadFile(any(MultipartFile.class),
                            eq(FileCategory.IMAGES), eq(RelatedType.INSTRUCTOR_BANNER), eq(200L), eq(1));

            assertThatCode(() -> service.registerInstructor(9L, req, banner()))
                    .doesNotThrowAnyException();

            verify(instructorRepository).save(any(Instructor.class));
            verify(s3Service).uploadFile(any(MultipartFile.class),
                    eq(FileCategory.IMAGES), eq(RelatedType.INSTRUCTOR_BANNER), eq(200L), eq(1));
        }
    }

    @Nested
    class UpdateInstructor {

        @Test
        @DisplayName("updateInstructor: 기존 배너/라이선스/커리어 삭제 후 공통정보 재생성")
        void update_ok() throws Exception {
            Long instructorId = 77L;

            Instructor existing = Instructor.builder().id(instructorId).introduction("intro").build();
            when(instructorQueryService.queryInstructorById(instructorId)).thenReturn(existing);

            InstructorProfileUpdateRequest req = mock(InstructorProfileUpdateRequest.class);

            LicenseItem licValid = licItem(5L, "기관", LocalDate.of(2021,5,5), "A");
            License license5 = mock(License.class);
            when(licenseQueryService.queryLicenseById(5L)).thenReturn(license5);
            when(req.getLicenses()).thenReturn(List.of(licValid));

            CareerItem cValid = careerItem("회사B");
            when(req.getCareers()).thenReturn(List.of(cValid));

            assertThatCode(() -> service.updateInstructor(instructorId, req, banner()))
                    .doesNotThrowAnyException();

            verify(s3Service).deleteFile(FileCategory.IMAGES, RelatedType.INSTRUCTOR_BANNER, instructorId, 1);
            verify(instructorLicenseManagementService).deleteInstrutorLicensesByInstructorId(instructorId);
            verify(careerManagementService).deleteCareersByInstructorId(instructorId);

            verify(s3Service).uploadFile(any(MultipartFile.class),
                    eq(FileCategory.IMAGES), eq(RelatedType.INSTRUCTOR_BANNER), eq(instructorId), eq(1));
            verify(instructorLicenseManagementService).saveInstructorLicense(any(InstructorLicense.class));
            verify(careerManagementService).saveCareer(any(Career.class));
        }

        @Test
        @DisplayName("updateInstructor: 라이선스 null/미존재 스킵, 배너 업로드 IOException도 삼킴")
        void update_skip_invalid_and_swallow_ioe() throws Exception {
            Long instructorId = 88L;
            when(instructorQueryService.queryInstructorById(instructorId))
                    .thenReturn(Instructor.builder().id(instructorId).build());

            InstructorProfileUpdateRequest req = mock(InstructorProfileUpdateRequest.class);

            LicenseItem licNullId = licItem(null, "x", LocalDate.now(), "x");
            LicenseItem licMissingOnQuery = licItem(10L, "y", LocalDate.now(), "y");
            when(licenseQueryService.queryLicenseById(10L)).thenReturn(null);
            when(req.getLicenses()).thenReturn(List.of(licNullId, licMissingOnQuery));

            CareerItem cValid = careerItem("회사C");
            CareerItem cBlank = careerItem("");
            when(req.getCareers()).thenReturn(List.of(cValid, cBlank));

            doThrow(new IOException("boom")).when(s3Service)
                    .uploadFile(any(MultipartFile.class),
                            eq(FileCategory.IMAGES), eq(RelatedType.INSTRUCTOR_BANNER), eq(instructorId), eq(1));

            assertThatCode(() -> service.updateInstructor(instructorId, req, banner()))
                    .doesNotThrowAnyException();

            verify(instructorLicenseManagementService, never()).saveInstructorLicense(any());
            verify(careerManagementService, times(1)).saveCareer(any(Career.class));
        }
    }
}
