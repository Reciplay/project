package com.e104_2.reciplaywebsocket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "subscription_histories")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubscriptionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "subscriber_count")
    private Integer subscriberCount;

    private LocalDate date;
}
