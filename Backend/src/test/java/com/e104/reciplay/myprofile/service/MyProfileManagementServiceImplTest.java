package com.e104.reciplay.myprofile.service;

import com.e104.reciplay.user.profile.dto.request.ProfileInfoRequest;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.profile.service.MyProfileManagementService;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Fail.fail;

@SpringBootTest
@ActiveProfiles("test")
class MyProfileManagementServiceImplIntegrationTest {
    @Autowired
    private MyProfileManagementService myProfileManagementService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    public void 유저_정보_수정에_성공한다() {
        User user = userRepository.save(User.builder().isActivated(true).role("USER").nickname("하나").name("필교")
                .email("wonjun@naver.com").job("프론트 개발자").password("123").gender(1).birthDate(LocalDate.of(2000, 2, 6)).build());

        ProfileInfoRequest request = new ProfileInfoRequest("원준", "백엔드 개발자", LocalDate.of(1999, 11, 10), 2);

        myProfileManagementService.setupMyProfile("wonjun@naver.com", request);

        User newUser = userRepository.findById(user.getId()).orElse(null);

        assertThat(newUser).isNotNull();
        assertThat(newUser.getName()).isEqualTo("원준");
        assertThat(newUser.getJob()).isEqualTo("백엔드 개발자");
        assertThat(newUser.getBirthDate()).isEqualTo(LocalDate.of(1999,11,10));
        assertThat(newUser.getGender()).isEqualTo(2);
    }
}