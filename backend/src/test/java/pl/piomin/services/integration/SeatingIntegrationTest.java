package pl.piomin.services.integration;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class SeatingIntegrationTest extends BaseIntegrationTest {

    private String token;
    private long wid;

    @BeforeEach
    void setUp() throws Exception {
        String email = uniqueEmail();
        token = registerAndGetToken(email, "Password123");
        wid = createWorkspaceAndGetId(token);
    }

    private String seatingUrl() {
        return "/api/workspaces/" + wid + "/seating-tables";
    }

    private String seatingUrl(long tableId) {
        return seatingUrl() + "/" + tableId;
    }

    private long createTable(String token, long workspaceId, String name, int chairCount) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "name", name,
                "tableShape", "ROUND",
                "chairCount", chairCount,
                "isVip", false
        ));

        MvcResult result = mockMvc.perform(post("/api/workspaces/" + workspaceId + "/seating-tables")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private long createHouseholdWithGuest(String token, long workspaceId, String guestName,
                                           int adults, int children) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "name", guestName,
                "side", "BRIDE",
                "adults", adults,
                "children", children,
                "newHouseholdStyle", "FAMILY",
                "householdName", guestName + " Household",
                "formalAddress", "The " + guestName + " Family"
        ));

        MvcResult result = mockMvc.perform(post("/api/workspaces/" + workspaceId + "/guests")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("householdId").asLong();
    }

    @Test
    void createTable_shouldReturn201() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "name", "Head Table",
                "tableShape", "ROUND",
                "chairCount", 10,
                "isVip", true
        ));

        mockMvc.perform(post(seatingUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Head Table"))
                .andExpect(jsonPath("$.chairCount").value(10))
                .andExpect(jsonPath("$.isVip").value(true));
    }

    @Test
    void updatePosition_shouldPersistCoordinates() throws Exception {
        long tableId = createTable(token, wid, "Table A", 8);

        String posBody = objectMapper.writeValueAsString(Map.of(
                "positionX", 100.5,
                "positionY", 200.3,
                "rotation", 45.0
        ));

        mockMvc.perform(patch(seatingUrl(tableId) + "/position")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(posBody))
                .andExpect(status().isOk());

        mockMvc.perform(get(seatingUrl(tableId))
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.positionX").value(100.5));
    }

    @Test
    void assignHousehold_shouldLinkToTable() throws Exception {
        long tableId = createTable(token, wid, "Table B", 10);
        long hid = createHouseholdWithGuest(token, wid, "Smith", 2, 0);

        String body = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.householdCount").value(1));
    }

    @Test
    void unassignHousehold_shouldRemoveFromTable() throws Exception {
        long tableId = createTable(token, wid, "Table C", 10);
        long hid = createHouseholdWithGuest(token, wid, "Jones", 2, 0);

        String assignBody = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assignBody))
                .andExpect(status().isOk());

        mockMvc.perform(delete(seatingUrl(tableId) + "/households/" + hid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get(seatingUrl(tableId))
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.householdCount").value(0));
    }

    @Test
    void unassignedHouseholds_shouldReturnCorrectList() throws Exception {
        long tableId = createTable(token, wid, "Table D", 10);
        long hid1 = createHouseholdWithGuest(token, wid, "Alpha", 1, 0);
        long hid2 = createHouseholdWithGuest(token, wid, "Beta", 1, 0);
        long hid3 = createHouseholdWithGuest(token, wid, "Gamma", 1, 0);

        String assignBody = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid1)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assignBody))
                .andExpect(status().isOk());

        mockMvc.perform(get(seatingUrl() + "/unassigned-households")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void stats_shouldReturnCapacityCounts() throws Exception {
        long tableId1 = createTable(token, wid, "Stats Table 1", 10);
        long tableId2 = createTable(token, wid, "Stats Table 2", 8);
        long hid = createHouseholdWithGuest(token, wid, "StatFamily", 2, 1);

        String assignBody = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid)
        ));

        mockMvc.perform(post(seatingUrl(tableId1) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assignBody))
                .andExpect(status().isOk());

        mockMvc.perform(get(seatingUrl() + "/stats")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTables").value(2))
                .andExpect(jsonPath("$.totalChairs").value(18))
                .andExpect(jsonPath("$.filledChairs").value(3));
    }

    @Test
    void deleteTable_shouldReturn204() throws Exception {
        long tableId = createTable(token, wid, "Temp Table", 6);

        mockMvc.perform(delete(seatingUrl(tableId))
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
    }

    @Test
    void assignHousehold_shouldReturn400WhenCapacityExceeded() throws Exception {
        long tableId = createTable(token, wid, "Small Table", 3);
        long hid = createHouseholdWithGuest(token, wid, "BigFamily", 2, 2);

        String body = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void assignHousehold_shouldReturn404ForNonexistentHousehold() throws Exception {
        long tableId = createTable(token, wid, "Table E", 10);

        String body = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(99999)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTable_shouldReturn400ForMissingName() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "chairCount", 8
        ));

        mockMvc.perform(post(seatingUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updatePosition_shouldAcceptPartialUpdate() throws Exception {
        long tableId = createTable(token, wid, "Partial Table", 8);

        String posBody = objectMapper.writeValueAsString(Map.of(
                "positionX", 50.0
        ));

        mockMvc.perform(patch(seatingUrl(tableId) + "/position")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(posBody))
                .andExpect(status().isOk());

        mockMvc.perform(get(seatingUrl(tableId))
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.positionX").value(50.0))
                .andExpect(jsonPath("$.positionY").isEmpty());
    }

    @Test
    void getTable_shouldIncludeHouseholdMembers() throws Exception {
        long tableId = createTable(token, wid, "Members Table", 10);
        long hid = createHouseholdWithGuest(token, wid, "John", 1, 0);

        String assignBody = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assignBody))
                .andExpect(status().isOk());

        mockMvc.perform(get(seatingUrl(tableId))
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.households[0].members[0].name").value("John"));
    }

    @Test
    void capacityValidation_shouldCountAdultsAndChildren() throws Exception {
        long tableId = createTable(token, wid, "Cap Table", 5);
        long hid1 = createHouseholdWithGuest(token, wid, "First", 2, 2);

        String assignBody1 = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid1)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assignBody1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.seatedCount").value(4));

        long hid2 = createHouseholdWithGuest(token, wid, "Second", 2, 0);

        String assignBody2 = objectMapper.writeValueAsString(Map.of(
                "householdIds", List.of(hid2)
        ));

        mockMvc.perform(post(seatingUrl(tableId) + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assignBody2))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listTables_shouldReturnAll() throws Exception {
        createTable(token, wid, "List Table 1", 6);
        createTable(token, wid, "List Table 2", 8);
        createTable(token, wid, "List Table 3", 10);

        mockMvc.perform(get(seatingUrl())
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }
}
