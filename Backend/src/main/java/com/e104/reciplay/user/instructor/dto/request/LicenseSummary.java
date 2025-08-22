package com.e104.reciplay.user.instructor.dto.request;

import com.e104.reciplay.entity.License;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LicenseSummary {
    private Long id;
    private String name;

    public LicenseSummary(License license) {
        this.id = license.getId();
        this.name = license.getName();
    }
}
