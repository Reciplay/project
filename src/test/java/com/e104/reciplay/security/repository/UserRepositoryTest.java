package com.e104.reciplay.security.repository;

import com.e104.reciplay.security.domain.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    private static final String TEST_USER_MAIL = "example@mail.com";

    @Test
    @Transactional
    public void 유저_삽입에_성공한다() {
        User user = User.builder().email(TEST_USER_MAIL).password("123").nickname("스폰지밥").build();
        userRepository.save(user);

        assertThat(userRepository.existsByEmail(TEST_USER_MAIL)).isTrue();
    }
}