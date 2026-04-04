package pl.piomin.services.integration;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class WorkspaceIntegrationTest extends BaseIntegrationTest {

    @Test
    void create_shouldReturn201WithPairingCode() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        String body = objectMapper.writeValueAsString(Map.of(
                "eventName", "My Wedding",
                "eventDate", "2026-06-15",
                "venue", "Grand Hotel",
                "budget", 50000
        ));

        mockMvc.perform(post("/api/workspaces")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.eventName").value("My Wedding"))
                .andExpect(jsonPath("$.pairingCode").isNotEmpty());
    }

    @Test
    void list_shouldReturnUserWorkspaces() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        createWorkspaceAndGetId(token);
        createWorkspaceAndGetId(token);

        mockMvc.perform(get("/api/workspaces")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void getById_shouldReturnDetails() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        long id = createWorkspaceAndGetId(token);

        mockMvc.perform(get("/api/workspaces/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventName").value("Test Wedding"))
                .andExpect(jsonPath("$.id").value(id));
    }

    @Test
    void update_shouldModifyWorkspace() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        long id = createWorkspaceAndGetId(token);

        String body = objectMapper.writeValueAsString(Map.of(
                "eventName", "Updated Wedding",
                "eventDate", "2026-07-20",
                "venue", "Beach Resort",
                "budget", 75000
        ));

        mockMvc.perform(put("/api/workspaces/" + id)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventName").value("Updated Wedding"));
    }

    @Test
    void join_shouldAddMemberViaCode() throws Exception {
        // User A creates workspace
        String emailA = uniqueEmail();
        String tokenA = registerAndGetToken(emailA, "Password123");

        String createBody = objectMapper.writeValueAsString(Map.of(
                "eventName", "Join Test Wedding",
                "eventDate", "2026-06-15",
                "venue", "Grand Hotel",
                "budget", 50000
        ));

        MvcResult createResult = mockMvc.perform(post("/api/workspaces")
                        .header("Authorization", bearer(tokenA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode createJson = objectMapper.readTree(createResult.getResponse().getContentAsString());
        String pairingCode = createJson.get("pairingCode").asText();
        long workspaceId = createJson.get("id").asLong();

        // User B joins via pairing code
        String emailB = uniqueEmail();
        String tokenB = registerAndGetToken(emailB, "Password123");

        String joinBody = objectMapper.writeValueAsString(Map.of(
                "pairingCode", pairingCode
        ));

        mockMvc.perform(post("/api/workspaces/join")
                        .header("Authorization", bearer(tokenB))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(joinBody))
                .andExpect(status().isOk());

        // Verify workspace has 2 members
        mockMvc.perform(get("/api/workspaces/" + workspaceId)
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.members", hasSize(2)));
    }

    @Test
    void invite_shouldAddMemberByEmail() throws Exception {
        // User A creates workspace
        String emailA = uniqueEmail();
        String tokenA = registerAndGetToken(emailA, "Password123");

        long workspaceId = createWorkspaceAndGetId(tokenA);

        // Register User B
        String emailB = uniqueEmail();
        String tokenB = registerAndGetToken(emailB, "Password123");

        // User A invites User B
        String inviteBody = objectMapper.writeValueAsString(Map.of(
                "email", emailB
        ));

        mockMvc.perform(post("/api/workspaces/" + workspaceId + "/invite")
                        .header("Authorization", bearer(tokenA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(inviteBody))
                .andExpect(status().isOk());

        // User B should see the workspace in their list
        mockMvc.perform(get("/api/workspaces")
                        .header("Authorization", bearer(tokenB)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(workspaceId));
    }

    @Test
    void join_shouldReturn404ForInvalidCode() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        String body = objectMapper.writeValueAsString(Map.of(
                "pairingCode", "XXXXXX"
        ));

        mockMvc.perform(post("/api/workspaces/join")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void join_shouldReturn400IfAlreadyMember() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        // Create workspace and extract pairing code
        String createBody = objectMapper.writeValueAsString(Map.of(
                "eventName", "Already Member Test",
                "eventDate", "2026-06-15",
                "venue", "Grand Hotel",
                "budget", 50000
        ));

        MvcResult createResult = mockMvc.perform(post("/api/workspaces")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode createJson = objectMapper.readTree(createResult.getResponse().getContentAsString());
        String pairingCode = createJson.get("pairingCode").asText();

        // Try to join own workspace again
        String joinBody = objectMapper.writeValueAsString(Map.of(
                "pairingCode", pairingCode
        ));

        mockMvc.perform(post("/api/workspaces/join")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(joinBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getById_shouldReturn403ForNonMember() throws Exception {
        // User A creates workspace
        String emailA = uniqueEmail();
        String tokenA = registerAndGetToken(emailA, "Password123");

        long workspaceId = createWorkspaceAndGetId(tokenA);

        // User B (not a member) tries to access
        String emailB = uniqueEmail();
        String tokenB = registerAndGetToken(emailB, "Password123");

        mockMvc.perform(get("/api/workspaces/" + workspaceId)
                        .header("Authorization", bearer(tokenB)))
                .andExpect(status().isForbidden());
    }

    @Test
    void create_shouldReturn400ForMissingName() throws Exception {
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");

        mockMvc.perform(post("/api/workspaces")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
