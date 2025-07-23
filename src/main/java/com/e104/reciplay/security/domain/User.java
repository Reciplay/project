package com.e104.reciplay.security.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email; // treated as a username

    private String password;

    private String nickname;

    private String name;

    private LocalDate birthday;

    private Integer gender;

    private String job;

    @Column(name = "signup_date")
    @CreatedDate
    private LocalDateTime signupDate;

    private String img;

    private Boolean activated;

    private String role;
}
