package com.e104.reciplay.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "categories")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Category {
    @Id
    private Long id;
    private String name;
}
