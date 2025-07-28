package com.e104.reciplay.user.instructor.dto.response.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriberHistory {
    private LocalDate date;
    private Integer subscriber;
}
