package com.e104.reciplay.user.profile.dto.response;

import com.e104.reciplay.common.types.FoodCategory;
import com.e104.reciplay.user.profile.dto.response.item.LevelSummary;
import com.e104.reciplay.user.security.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileInformation {
    private Boolean activated;
    private LocalDate birthDate;
    private LocalDateTime createdAt;
    private String email;
    private Integer gender;
    private String imgUrl;
    private String job;
    private String name;
    private String nickname;
    private List<LevelSummary> levels;

    public ProfileInformation(User user) {
        this.birthDate = user.getBirthDate();
        this.createdAt = user.getCreatedAt();
        this.email = user.getEmail();
        this.gender = user.getGender();
        this.job = user.getJob();
        this.name = user.getName();
        this.nickname = user.getNickname();
    }
}
