package com.e104.reciplay.user.subscription.service;


import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.entity.Subscription;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.repository.SubSubscriptionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.google.protobuf.DescriptorProtos;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionManagementServiceImpl implements SubscriptionManagementService{
    private final SubSubscriptionRepository subscriptionRepository;
    private final SubscriptionQueryService subscriptionQueryService;
    private final UserQueryService userQueryService;
    private final InstructorRepository instructorRepository;
    private final InstructorQueryService instructorQueryService;

    @Override
    public void subscribeInstructor(Long instructorId, String email) {
        User user = userQueryService.queryUserByEmail(email);
        // 존재하는 강사인지 확인.
        if(!instructorRepository.existsById(instructorId)) {
            throw new IllegalArgumentException("존재하지 않는 강사 입니다.");
        }
        // 자기 자신인 경우 -> 나중에 추가할 것.
        Instructor instructor = instructorQueryService.queryInstructorById(instructorId);
        User instructorUser = userQueryService.queryUserById(instructor.getUserId());
        if(instructorUser.equals(user)) {
            throw new IllegalArgumentException("자기자신은 구독할 수 없습니다.");
        }

        // 이미 구독했는지 확인.
        if(subscriptionQueryService.isSubscribedInstructor(instructorId, user.getId())) {
            throw new IllegalArgumentException("이미 구독한 강사입니다.");
        }

        subscriptionRepository.save(new Subscription(null, user.getId(), instructorId, null));
    }

    @Override
    @Transactional
    public void cancleSubscription(Long instructorId, String email) {
        User user = userQueryService.queryUserByEmail(email);
        // 존재하는 강사인지 확인.
        if(!instructorRepository.existsById(instructorId)) {
            throw new IllegalArgumentException("존재하지 않는 강사 입니다.");
        }
        // 자기 자신인 경우 -> 나중에 추가할 것.
        Instructor instructor = instructorQueryService.queryInstructorById(instructorId);
        User instructorUser = userQueryService.queryUserById(instructor.getUserId());
        if(instructorUser.equals(user)) {
            throw new IllegalArgumentException("자기자신은 구독취소할 수 없습니다.");
        }
        // 이미 구독했는지 확인.
        if(!subscriptionQueryService.isSubscribedInstructor(instructorId, user.getId())) {
            throw new IllegalArgumentException("구독하지 않은 강사입니다.");
        }

        subscriptionRepository.deleteByInstructorIdAndUserId(instructorId, user.getId());
    }
}
