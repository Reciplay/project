package com.e104.reciplay.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminUserDetail {
    private Long userId;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private Boolean role;
    private String job;
    private String nickname;
    private String birthDate;
}
