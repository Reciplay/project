package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdUserDetail;
import com.e104.reciplay.admin.dto.response.AdUserSummary;

import java.util.List;

public interface AdUserQueryService {
    List<AdUserSummary> queryUserSummaries();
    AdUserDetail queryUserDetail(Long userId);
}
