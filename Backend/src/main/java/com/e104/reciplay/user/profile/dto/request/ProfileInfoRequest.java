package com.e104.reciplay.user.profile.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileInfoRequest {
    private String name;
    private String job;
    private LocalDate birthDate;
    private Integer gender;
}
