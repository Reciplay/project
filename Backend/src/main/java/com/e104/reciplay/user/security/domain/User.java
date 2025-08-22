package com.e104.reciplay.user.security.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.util.FileCopyUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLRestriction("is_activated = true")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email; // treated as a username

    private String password;

    private String nickname;

    private String name;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    private Integer gender;

    private String job;

    @Column(name = "created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    private Boolean isActivated;

    private String role;
}
