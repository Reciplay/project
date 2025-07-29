package com.e104.reciplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

@Entity(name = "instructors")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class instructor {
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
}
