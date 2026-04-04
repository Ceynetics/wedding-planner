package pl.piomin.services.integration;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GuestWorkflowIntegrationTest extends BaseIntegrationTest {

    private String token;
    private long wid;

    @BeforeEach
    void setUp() throws Exception {
        String email = uniqueEmail();
        token = registerAndGetToken(email, "Password1!");
        wid = createWorkspaceAndGetId(token);
    }

    private MvcResult createGuest(String token, long workspaceId, String name, String side) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("side", side);
        body.put("newHouseholdStyle", "INDIVIDUAL");
        return mockMvc.perform(post("/api/workspaces/{wid}/guests", workspaceId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
    }

    @Test
    void createGuest_shouldAutoCreateHousehold() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "John Smith");
        body.put("side", "GROOM");
        body.put("newHouseholdStyle", "INDIVIDUAL");

        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.householdId").isNotEmpty());
    }

    @Test
    void createGuest_shouldAutoGenerateFamilyAddress() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Robert Johnson");
        body.put("side", "GROOM");
        body.put("newHouseholdStyle", "FAMILY");

        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.householdName").value(org.hamcrest.Matchers.containsString("Johnson")));
    }

    @Test
    void createGuest_shouldJoinExistingHousehold() throws Exception {
        // Create household first
        Map<String, Object> householdBody = new HashMap<>();
        householdBody.put("householdName", "The Smiths");
        householdBody.put("addressStyle", "COUPLE");

        MvcResult hhResult = mockMvc.perform(post("/api/workspaces/{wid}/households", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(householdBody)))
                .andExpect(status().isCreated())
                .andReturn();

        long householdId = objectMapper.readTree(hhResult.getResponse().getContentAsString())
                .get("id").asLong();

        // Create guest with that household
        Map<String, Object> guestBody = new HashMap<>();
        guestBody.put("name", "Alice Smith");
        guestBody.put("side", "BRIDE");
        guestBody.put("householdId", householdId);

        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guestBody)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.householdId").value(householdId));
    }

    @Test
    void listGuests_shouldReturnAll() throws Exception {
        createGuest(token, wid, "Guest A", "GROOM");
        createGuest(token, wid, "Guest B", "BRIDE");
        createGuest(token, wid, "Guest C", "GROOM");

        mockMvc.perform(get("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void listGuests_shouldFilterByStatus() throws Exception {
        MvcResult r1 = createGuest(token, wid, "Guest One", "GROOM");
        createGuest(token, wid, "Guest Two", "BRIDE");

        long guestId = objectMapper.readTree(r1.getResponse().getContentAsString())
                .get("id").asLong();

        // Update first guest to CONFIRMED
        Map<String, Object> updateBody = new HashMap<>();
        updateBody.put("name", "Guest One");
        updateBody.put("side", "GROOM");
        updateBody.put("status", "CONFIRMED");

        mockMvc.perform(put("/api/workspaces/{wid}/guests/{id}", wid, guestId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateBody)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .param("status", "CONFIRMED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void listGuests_shouldFilterBySearch() throws Exception {
        createGuest(token, wid, "John Smith", "GROOM");
        createGuest(token, wid, "Jane Doe", "BRIDE");

        mockMvc.perform(get("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .param("search", "smith"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getStats_shouldReturnCorrectCounts() throws Exception {
        createGuest(token, wid, "Guest A", "GROOM");
        createGuest(token, wid, "Guest B", "BRIDE");

        // Create a VIP guest
        Map<String, Object> vipBody = new HashMap<>();
        vipBody.put("name", "VIP Guest");
        vipBody.put("side", "GROOM");
        vipBody.put("isVip", true);
        vipBody.put("newHouseholdStyle", "INDIVIDUAL");

        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vipBody)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/workspaces/{wid}/guests/stats", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(3))
                .andExpect(jsonPath("$.pending").value(org.hamcrest.Matchers.greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.vipCount").value(1));
    }

    @Test
    void updateGuest_shouldModifyFields() throws Exception {
        MvcResult result = createGuest(token, wid, "Original Name", "GROOM");
        long guestId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();

        Map<String, Object> updateBody = new HashMap<>();
        updateBody.put("name", "Updated");
        updateBody.put("side", "GROOM");
        updateBody.put("status", "CONFIRMED");

        mockMvc.perform(put("/api/workspaces/{wid}/guests/{id}", wid, guestId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));
    }

    @Test
    void deleteGuest_shouldRemoveGuest() throws Exception {
        MvcResult result = createGuest(token, wid, "To Delete", "GROOM");
        long guestId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(delete("/api/workspaces/{wid}/guests/{id}", wid, guestId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/workspaces/{wid}/guests/{id}", wid, guestId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createGuest_shouldReturn400ForMissingName() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("side", "GROOM");

        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createGuest_shouldReturn400ForMissingSide() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Test");

        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createGuest_shouldReturn403ForNonMember() throws Exception {
        // User B registers and gets a token but is NOT a member of User A's workspace
        String emailB = uniqueEmail();
        String tokenB = registerAndGetToken(emailB, "Password1!");

        Map<String, Object> body = new HashMap<>();
        body.put("name", "Intruder Guest");
        body.put("side", "GROOM");
        body.put("newHouseholdStyle", "INDIVIDUAL");

        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(tokenB))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateGuest_shouldReturn404ForNonexistent() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Ghost");
        body.put("side", "GROOM");

        mockMvc.perform(put("/api/workspaces/{wid}/guests/{id}", wid, 99999)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNotFound());
    }

    @Test
    void householdList_shouldReturnCreatedHouseholds() throws Exception {
        // Each guest auto-creates a household
        createGuest(token, wid, "Guest Alpha", "GROOM");
        createGuest(token, wid, "Guest Beta", "BRIDE");

        mockMvc.perform(get("/api/workspaces/{wid}/households", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(org.hamcrest.Matchers.greaterThanOrEqualTo(2)));
    }
}
