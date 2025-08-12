package com.e104.reciplay.user.subscription.dto;

import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionInfo {
    ResponseFileInfo instructorProfileFileInfo;
    String instructorName;
    Long instructorId;
    Integer subscriberCount;
}
