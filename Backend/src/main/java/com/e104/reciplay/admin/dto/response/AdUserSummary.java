package com.e104.reciplay.admin.dto.response;

import com.e104.reciplay.user.security.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdUserSummary {
    private Long userId;
    private String name;
    private String email;
    private LocalDateTime createdAt;

    public AdUserSummary(User user){
        this.userId = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
    }
}
