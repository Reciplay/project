package com.e104.reciplay.user.instructor.dto.response.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaDetail {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime questionAt;
    private String courseName;
    private Long courseId;
}
