package com.e104.reciplay.security.repository;

import com.e104.reciplay.common.config.QueryDslConfig;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(QueryDslConfig.class)
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