package com.e104.reciplay.user.auth.mail.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {
    private final JavaMailSender javaMailSender;

    public void sendSimpleMailMessage(String receiver, String subject, String text) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();

        try {
            simpleMailMessage.setTo(receiver);
            simpleMailMessage.setSubject(subject);
            simpleMailMessage.setText(text);

            javaMailSender.send(simpleMailMessage);
            log.info("메일 전송 완료.");
        } catch(Exception e) {
            log.info("메일 전송 실패");
        }
    }

    public String formAuthEmailText(String purpose, String token) {
        return """
                Let's play! reciplay!
                %s를 위한 인증번호 메일입니다.
                「 %s 」
                
                양끝 모서리 문자를 제외한 내부 문자열을 입력해주세요!
                주의. 유효시간 3분입니다.
                """.formatted(purpose, token);
    }
}
