package com.e104.reciplay.security.service;

import com.e104.reciplay.user.security.dto.SignupRequest;
import com.e104.reciplay.user.security.exception.DuplicateUserEmailException;
import com.e104.reciplay.user.security.repository.UserRepository;
import com.e104.reciplay.user.security.service.SignupServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SignupServiceImplTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @InjectMocks
    private SignupServiceImpl signupService;

    private static final String TEST_USER_MAIL = "example@mail.com";
    private static final String TEST_USER_PASSWORD = "123";

    @Test
    public void 중복_없는_아이디로_회원가입에_성공한다() {
        Mockito.when(userRepository.existsByEmail(TEST_USER_MAIL)).thenReturn(false);
        Mockito.when(bCryptPasswordEncoder.encode(TEST_USER_PASSWORD)).thenReturn(TEST_USER_PASSWORD);

        SignupRequest request = new SignupRequest(TEST_USER_MAIL, TEST_USER_PASSWORD, "");

        assertDoesNotThrow(()->signupService.signup(request));
        Mockito.verify(bCryptPasswordEncoder, Mockito.times(1)).encode(TEST_USER_PASSWORD);
    }

    @Test
    public void 아이디_중복으로_회원가입에_실패한다() {
        Mockito.when(userRepository.existsByEmail(TEST_USER_MAIL)).thenReturn(true);

        SignupRequest request = new SignupRequest(TEST_USER_MAIL, TEST_USER_PASSWORD, "");

        assertThrows(DuplicateUserEmailException.class, () -> signupService.signup(request));
    }
}