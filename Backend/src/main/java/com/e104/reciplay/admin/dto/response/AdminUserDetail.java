package com.e104.reciplay.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminUserDetail {
    private Long userId;
    private String name;
    private String email;
    private String createdAt;
    private Boolean role;
    private String job;
    private String nickname;
    private String birthDate;
}
