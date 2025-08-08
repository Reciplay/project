package com.e104.reciplay.course.lecture.dto.response.request;

import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LectureRegisterRequest {
    private LectureRequest lectureRequest;
    private MultipartFile material;
}
