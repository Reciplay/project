package com.e104_2.reciplaywebsocket.common.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/test")
    public String testP() {
        return "Accepted!";
    }
}
