package com.e104_2.reciplaywebsocket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity(name = "instructors")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    private String introduction;

    @Column(name = "is_approved")
    private Boolean isApproved;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;
}
