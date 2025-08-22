package com.e104.reciplay.user.profile.dto.response.item;

import com.e104.reciplay.entity.Level;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LevelSummary {
    private String category;
    private Long categoryId;
    private Integer level;

    public LevelSummary(Level level) {

    }
}
