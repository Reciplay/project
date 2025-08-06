package com.e104.reciplay.user.auth.mail.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MailServiceTest {
    @Autowired
    MailService mailService;

    @Test
    public void 테스트_메일_전송_시도() {
        mailService.sendSimpleMailMessage("evenil0206@gmail.com", "테스트 메일입니다.", "1353154 이원준");
    }
}