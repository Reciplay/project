package com.e104.reciplay.admin.service;

import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdUserManagementServiceImplTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    AdUserManagementServiceImpl service;

    @Test
    @DisplayName("updateUserRoleToInstructor: 레포지토리 위임 호출")
    void updateUserRoleToInstructor_delegatesToRepo() {
        // when
        service.updateUserRoleToInstructor(123L);

        // then
        verify(userRepository, times(1)).updateUserRoleToInstructorById(123L);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    @DisplayName("deleteUser: 사용자 존재 시 비활성화(setIsActivated(false)) 후 save 호출")
    void deleteUser_deactivatesAndSaves() {
        long userId = 10L;

        // User를 mock으로 만들어 setIsActivated(false) 호출 검증
        User user = mock(User.class);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        service.deleteUser(userId);

        // then
        verify(userRepository, times(1)).findById(userId);
        verify(user, times(1)).setIsActivated(false);
        verify(userRepository, times(1)).save(user);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    @DisplayName("deleteUser: 사용자 미존재 시 EntityNotFoundException 발생 및 save 미호출")
    void deleteUser_userNotFound_throws() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.deleteUser(999L));

        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
        verifyNoMoreInteractions(userRepository);
    }
}
