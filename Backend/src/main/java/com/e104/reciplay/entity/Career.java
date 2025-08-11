package com.e104.reciplay.entity;

import com.e104.reciplay.user.instructor.dto.response.item.CareerItem;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "careers")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Career {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "company_name")
    private String companyName;

    private String position;

    @Column(name = "job_description")
    private String jobDescription;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    public Career(CareerItem item, Long instructorId){
        this.instructorId = instructorId;
        this.companyName = item.getCompanyName();
        this.position = item.getPosition();
        this.jobDescription = item.getJobDescription();
        this.startDate = item.getStartDate();
        this.endDate = item.getEndDate();
    }
}
