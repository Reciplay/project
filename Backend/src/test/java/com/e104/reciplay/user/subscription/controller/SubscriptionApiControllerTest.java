package com.e104.reciplay.user.subscription.controller;

import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import com.e104.reciplay.user.subscription.dto.SubscriptionInfo;
import com.e104.reciplay.user.subscription.service.SubscriptionManagementService;
import com.e104.reciplay.user.subscription.service.SubscriptionQueryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SubscriptionApiControllerTest {

    @Mock private SubscriptionManagementService subscriptionManagementService;
    @Mock private SubscriptionQueryService subscriptionQueryService;
    @Mock private UserQueryService userQueryService;

    private MockMvc mockMvc;

    // 공통 상수
    private final String email = "user@example.com";

    @BeforeEach
    void setUp() {
        // 스프링 컨테이너 없이 컨트롤러 직접 생성
        SubscriptionApiController controller =
                new SubscriptionApiController(subscriptionManagementService, subscriptionQueryService, userQueryService);

        // 기본 MockMvc (인증 principal 리졸버는 각 테스트에서 필요할 때만 세팅)
        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders
                .standaloneSetup(controller)
                .build();
    }

    /**
     * @AuthenticationPrincipal(CustomUserDetails) 를 사용하는 엔드포인트용 리졸버를
     * 필요한 테스트에서만 주입하기 위한 헬퍼
     */
    private void attachAuthPrincipalResolver(CustomUserDetails principal) {
        HandlerMethodArgumentResolver authPrincipalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.getParameterType().equals(CustomUserDetails.class)
                        && parameter.hasParameterAnnotation(org.springframework.security.core.annotation.AuthenticationPrincipal.class);
            }
            @Override
            public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                          org.springframework.web.context.request.NativeWebRequest webRequest,
                                          WebDataBinderFactory binderFactory) {
                return principal;
            }
        };

        // 기존 컨트롤러로 다시 세팅(리졸버 추가)
        SubscriptionApiController controller =
                new SubscriptionApiController(subscriptionManagementService, subscriptionQueryService, userQueryService);

        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders
                .standaloneSetup(controller)
                .setCustomArgumentResolvers(authPrincipalResolver)
                .build();
    }

    @Nested
    @DisplayName("POST /api/v1/user/subscription - 구독")
    class SubscribeInstructor {

        @Test
        @DisplayName("성공: instructorId 파라미터와 인증 사용자로 구독")
        void subscribe_success() throws Exception {
            // 이 엔드포인트가 @AuthenticationPrincipal을 사용한다면 principal 리졸버 필요
            CustomUserDetails principalMock = mock(CustomUserDetails.class);
            when(principalMock.getUsername()).thenReturn(email);
            attachAuthPrincipalResolver(principalMock);

            mockMvc.perform(post("/api/v1/user/subscription")
                            .param("instructorId", "123")
                            .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").exists());

            verify(subscriptionManagementService).subscribeInstructor(123L, email);
            verifyNoMoreInteractions(subscriptionManagementService);
        }
    }

    @Nested
    @DisplayName("DELETE /api/v1/user/subscription - 구독 취소")
    class UnsubscribeInstructor {

        @Test
        @DisplayName("성공: instructorId 파라미터와 인증 사용자로 구독 취소")
        void unsubscribe_success() throws Exception {
            // 이 엔드포인트도 @AuthenticationPrincipal을 사용한다면 리졸버 세팅
            CustomUserDetails principalMock = mock(CustomUserDetails.class);
            when(principalMock.getUsername()).thenReturn(email);
            attachAuthPrincipalResolver(principalMock);

            mockMvc.perform(delete("/api/v1/user/subscription")
                            .param("instructorId", "456"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").exists());

            verify(subscriptionManagementService).cancleSubscription(456L, email);
            verifyNoMoreInteractions(subscriptionManagementService);
        }
    }

    @Nested
    @DisplayName("GET /api/v1/user/subscription/list - 구독 리스트 조회")
    class GetSubscriptions {

        @Test
        @DisplayName("성공: 세션 이메일로 userId 조회 후 구독 리스트 반환")
        void list_success() throws Exception {
            // 이 엔드포인트는 AuthenticationUtil.getSessionUsername() 사용
            try (MockedStatic<AuthenticationUtil> mocked = mockStatic(AuthenticationUtil.class)) {
                mocked.when(AuthenticationUtil::getSessionUsername).thenReturn(email);

                var userMock = mock(com.e104.reciplay.user.security.domain.User.class);
                given(userQueryService.queryUserByEmail(email)).willReturn(userMock);
                // getId()만 쓰니 심플 스텁이면 충분
                when(userMock.getId()).thenReturn(777L);

                var list = List.of(
                        mock(SubscriptionInfo.class),
                        mock(SubscriptionInfo.class)
                );
                given(subscriptionQueryService.queryUserSubscriptionsByUserId(777L)).willReturn(list);

                mockMvc.perform(get("/api/v1/user/subscription/list"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.message").exists())
                        .andExpect(jsonPath("$.data").isArray());

                verify(subscriptionQueryService).queryUserSubscriptionsByUserId(777L);
                verify(userQueryService).queryUserByEmail(email);
                verifyNoMoreInteractions(subscriptionQueryService, userQueryService);
            }
        }
    }
}
