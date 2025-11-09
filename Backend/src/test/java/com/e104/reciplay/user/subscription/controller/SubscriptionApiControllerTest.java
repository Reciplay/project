package com.e104.reciplay.user.subscription.controller;

import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import com.e104.reciplay.user.subscription.dto.SubscribedInstructorItem;
import com.e104.reciplay.user.subscription.service.SubscriptionManagementService;
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
import org.junit.jupiter.api.Disabled;
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
    @Mock private UserQueryService userQueryService;
    @Mock private InstructorQueryService instructorQueryService;

    private MockMvc mockMvc;

    private static final String EMAIL = "user@example.com";

    @BeforeEach
    void setUp() {
        // 스프링 컨테이너 없이 컨트롤러 직접 주입
        SubscriptionApiController controller =
                new SubscriptionApiController(subscriptionManagementService, userQueryService, instructorQueryService);

        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders
                .standaloneSetup(controller)
                .build();
    }

    /** @AuthenticationPrincipal 주입용 리졸버를 덧씌우기 위한 헬퍼 */
    private void attachAuthPrincipalResolver(CustomUserDetails principal) {
        HandlerMethodArgumentResolver resolver = new HandlerMethodArgumentResolver() {
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

        // 기존 컨트롤러 재생성 + 리졸버 추가
        SubscriptionApiController controller =
                new SubscriptionApiController(subscriptionManagementService, userQueryService, instructorQueryService);

        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders
                .standaloneSetup(controller)
                .setCustomArgumentResolvers(resolver)
                .build();
    }

    @Nested
    @DisplayName("POST /api/v1/user/subscription - 구독")
    class SubscribeInstructor {

        @Test
        @DisplayName("성공: instructorId 파라미터와 인증 사용자로 구독")
        void subscribe_success() throws Exception {
            CustomUserDetails principal = mock(CustomUserDetails.class);
            when(principal.getUsername()).thenReturn(EMAIL);
            attachAuthPrincipalResolver(principal);

            mockMvc.perform(post("/api/v1/user/subscription")
                            .param("instructorId", "123")
                            .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").exists());

            verify(subscriptionManagementService).subscribeInstructor(123L, EMAIL);
            verifyNoMoreInteractions(subscriptionManagementService, userQueryService, instructorQueryService);
        }
    }

    @Nested
    @DisplayName("DELETE /api/v1/user/subscription - 구독 취소")
    class UnsubscribeInstructor {

        @Test
        @DisplayName("성공: instructorId 파라미터와 인증 사용자로 구독 취소")
        void unsubscribe_success() throws Exception {
            CustomUserDetails principal = mock(CustomUserDetails.class);
            when(principal.getUsername()).thenReturn(EMAIL);
            attachAuthPrincipalResolver(principal);

            mockMvc.perform(delete("/api/v1/user/subscription")
                            .param("instructorId", "456"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").exists());

            verify(subscriptionManagementService).cancleSubscription(456L, EMAIL);
            verifyNoMoreInteractions(subscriptionManagementService, userQueryService, instructorQueryService);
        }
    }

    @Nested
    @DisplayName("GET /api/v1/user/subscription/list - 구독 리스트 조회")
    class GetSubscriptions {

        @Test
        @DisplayName("성공: 세션 이메일로 userId 조회 후 구독 리스트 반환")
        void list_success() throws Exception {
            try (MockedStatic<AuthenticationUtil> mocked = mockStatic(AuthenticationUtil.class)) {
                mocked.when(AuthenticationUtil::getSessionUsername).thenReturn(EMAIL);

                var user = mock(com.e104.reciplay.user.security.domain.User.class);
                when(user.getId()).thenReturn(777L);
                given(userQueryService.queryUserByEmail(EMAIL)).willReturn(user);

                // DTO는 실제 클래스 인스턴스로 만드는 게 직렬화에 안전하지만,
                // 여기서는 구조를 몰라 간단히 mock으로 대체하고 data가 배열임만 검증
                List<SubscribedInstructorItem> items = List.of(
                        mock(SubscribedInstructorItem.class),
                        mock(SubscribedInstructorItem.class)
                );
                given(instructorQueryService.queryUserSubscriptionsByUserId(777L)).willReturn(items);

                mockMvc.perform(get("/api/v1/user/subscription/list"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.message").exists())
                        .andExpect(jsonPath("$.data").isArray());

                verify(userQueryService).queryUserByEmail(EMAIL);
                verify(instructorQueryService).queryUserSubscriptionsByUserId(777L);
                verifyNoMoreInteractions(subscriptionManagementService, userQueryService, instructorQueryService);
            }
        }
    }
}
