package com.e104.reciplay.entity;

import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
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

    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    public Instructor(InstructorApplicationRequest request, Long userId){
        this.userId = userId;
        this.introduction = request.getIntroduction();
        this.isApproved = false;
        this.address = request.getAddress();
        this.phoneNumber = request.getPhoneNumber();
        this.registeredAt = LocalDateTime.now();
    }

}
