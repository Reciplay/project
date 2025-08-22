package com.e104.reciplay.admin.dto.response;

import com.e104.reciplay.user.security.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdUserDetail {
    private Long userId;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private String role;
    private String job;
    private String nickname;
    private LocalDate birthDate;

    public AdUserDetail(User user){
        this.userId = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
        this.role = user.getRole();
        this.job = user.getJob();
        this.nickname = user.getNickname();
        this.birthDate = user.getBirthDate();
    }
}
