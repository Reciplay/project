package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.request.CourseCardCondition;
import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface CourseCardQueryService {
    PagedResponse<CourseCard> queryCardsByCardCondtion(CourseCardCondition condition, Pageable pageable, Long userId);
}
