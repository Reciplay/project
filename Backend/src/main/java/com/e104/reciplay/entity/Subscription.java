package com.e104.reciplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "subscriptions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "subscribed_date")
    private LocalDate subscribedDate;
}
