package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping("/api/test/course/courses")
@Slf4j
public class CourseSubApiController {

    @PostMapping("/lectures")
    public ResponseEntity<?> recieveComplexLectures(
      @RequestPart("lecture") List<LectureRequest> lectureRequests,
      MultipartHttpServletRequest multipartRequest
    )  {
        log.info("lectureRequests: {}", lectureRequests);
        Iterator<String> iter = multipartRequest.getFileNames();
        while(iter.hasNext()) {
            MultipartFile file = multipartRequest.getFile(iter.next());
            log.info("file name {}", file.getName());
            log.info("file original name {}", file.getOriginalFilename());
            log.info("file size {}", file.getSize());
            log.info("file Content-Type {}", file.getContentType());
        }

        return CommonResponseBuilder.success("", null);
    }
}
