package com.e104.reciplay.security.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity(name = "tokens")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String plain;

    @Column(name = "is_expired")
    @ColumnDefault("false")
    private Boolean isExpired;

    private String type;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String username;
}
