package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdUserDetail;
import com.e104.reciplay.admin.dto.response.AdUserSummary;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdUserQueryServiceImplTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    AdUserQueryServiceImpl service;

    @Test
    @DisplayName("queryUserSummaries: 사용자 2건 -> AdUserSummary 2건으로 매핑")
    void queryUserSummaries_mapsAllUsers() {
        User u1 = mock(User.class, Answers.RETURNS_DEEP_STUBS);
        User u2 = mock(User.class, Answers.RETURNS_DEEP_STUBS);
        given(userRepository.findAll()).willReturn(List.of(u1, u2));

        List<AdUserSummary> result = service.queryUserSummaries();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.get(0) instanceof AdUserSummary);
        assertTrue(result.get(1) instanceof AdUserSummary);

        verify(userRepository, times(1)).findAll();
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    @DisplayName("queryUserSummaries: 사용자 0건 -> 빈 리스트 반환")
    void queryUserSummaries_empty() {
        given(userRepository.findAll()).willReturn(List.of());

        List<AdUserSummary> result = service.queryUserSummaries();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(userRepository, times(1)).findAll();
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    @DisplayName("queryUserDetail: 존재하는 사용자 -> AdUserDetail 반환")
    void queryUserDetail_success() {
        long userId = 42L;
        User user = mock(User.class);
        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        AdUserDetail detail = service.queryUserDetail(userId);

        assertNotNull(detail);
        assertTrue(detail instanceof AdUserDetail);

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    @DisplayName("queryUserDetail: 미존재 사용자 -> IllegalArgumentException")
    void queryUserDetail_notFound_throws() {
        long userId = 404L;
        given(userRepository.findById(userId)).willReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.queryUserDetail(userId));
        assertTrue(ex.getMessage().contains("존재하지 않는 회원"));

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userRepository);
    }
}
