package pl.piomin.services.integration;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class AuthIntegrationTest extends BaseIntegrationTest {

    @Test
    void register_shouldReturn201WithTokens() throws Exception {
        String email = uniqueEmail();
        String body = objectMapper.writeValueAsString(Map.of(
                "fullName", "Test User",
                "email", email,
                "password", "Password123",
                "gender", "MALE",
                "age", 30
        ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value(email));
    }

    @Test
    void login_shouldReturn200WithTokens() throws Exception {
        String email = uniqueEmail();
        registerAndGetToken(email, "Password123");

        String body = objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", "Password123"
        ));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty());
    }

    @Test
    void me_shouldReturnCurrentUser() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Test User"))
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    void refresh_shouldReturnNewTokens() throws Exception {
        String email = uniqueEmail();
        String registerBody = objectMapper.writeValueAsString(Map.of(
                "fullName", "Test User",
                "email", email,
                "password", "Password123",
                "gender", "MALE",
                "age", 30
        ));

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode registerJson = objectMapper.readTree(registerResult.getResponse().getContentAsString());
        String refreshToken = registerJson.get("refreshToken").asText();

        String refreshBody = objectMapper.writeValueAsString(Map.of(
                "refreshToken", refreshToken
        ));

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty());
    }

    @Test
    void updateProfile_shouldModifyUser() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        String body = objectMapper.writeValueAsString(Map.of(
                "fullName", "Updated Name",
                "phone", "123"
        ));

        mockMvc.perform(put("/api/auth/profile")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated Name"));
    }

    @Test
    void register_shouldReturn400ForDuplicateEmail() throws Exception {
        String email = uniqueEmail();
        registerAndGetToken(email, "Password123");

        String body = objectMapper.writeValueAsString(Map.of(
                "fullName", "Another User",
                "email", email,
                "password", "Password123",
                "gender", "FEMALE",
                "age", 25
        ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsStringIgnoringCase("already")));
    }

    @Test
    void register_shouldReturn400ForMissingFields() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_shouldReturn400ForShortPassword() throws Exception {
        String email = uniqueEmail();
        String body = objectMapper.writeValueAsString(Map.of(
                "fullName", "Test User",
                "email", email,
                "password", "abc",
                "gender", "MALE",
                "age", 30
        ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_shouldReturn400ForInvalidEmail() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "fullName", "Test User",
                "email", "notanemail",
                "password", "Password123",
                "gender", "MALE",
                "age", 30
        ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_shouldReturn401ForWrongPassword() throws Exception {
        String email = uniqueEmail();
        registerAndGetToken(email, "Password123");

        String body = objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", "WrongPassword999"
        ));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_shouldReturn401ForNonexistentEmail() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "email", "nonexistent_" + System.nanoTime() + "@test.com",
                "password", "Password123"
        ));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_shouldReturn403WithNoToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isForbidden());
    }
}
