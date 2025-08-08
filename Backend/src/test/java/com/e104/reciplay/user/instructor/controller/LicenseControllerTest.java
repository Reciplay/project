package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.user.instructor.service.LicenseQueryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class LicenseControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    @Sql(scripts = "classpath:license_data.sql")
    public void 자격증_목록_조회에_성공한다() throws Exception{
        String url = "/api/v1/user/license/list";
        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get(url));

        resultActions.andExpect(status().isOk());
        resultActions.andDo(MockMvcResultHandlers.print());
        resultActions.andExpect(jsonPath("$.data").isNotEmpty());
    }
}