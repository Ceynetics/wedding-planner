package pl.piomin.services.integration;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class InvitationIntegrationTest extends BaseIntegrationTest {

    private String token;
    private long wid;

    @BeforeEach
    void setUp() throws Exception {
        String email = uniqueEmail();
        token = registerAndGetToken(email, "Password123");
        wid = createWorkspaceAndGetId(token);
    }

    private String invitationUrl() {
        return "/api/workspaces/" + wid + "/invitations";
    }

    private String invitationUrl(long id) {
        return invitationUrl() + "/" + id;
    }

    private long createHouseholdAndGetId(String token, long workspaceId, String name,
                                          String style, String formalAddress) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "householdName", name,
                "addressStyle", style,
                "formalAddress", formalAddress
        ));

        MvcResult result = mockMvc.perform(post("/api/workspaces/" + workspaceId + "/households")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private long createInvitation(long householdId) throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put("templateId", "classic");
        map.put("name1", "Alice");
        map.put("name2", "Bob");
        map.put("eventDate", "2026-06-15");
        map.put("eventTime", "14:00:00");
        map.put("venue", "Grand Hotel");
        map.put("householdId", householdId);

        String body = objectMapper.writeValueAsString(map);

        MvcResult result = mockMvc.perform(post(invitationUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    @Test
    void createInvitation_shouldAutoPopulateGreeting() throws Exception {
        long hid = createHouseholdAndGetId(token, wid, "Smith Family", "FAMILY",
                "Mr. and Mrs. Smith");

        Map<String, Object> map = new HashMap<>();
        map.put("templateId", "classic");
        map.put("name1", "Alice");
        map.put("name2", "Bob");
        map.put("eventDate", "2026-06-15");
        map.put("eventTime", "14:00:00");
        map.put("venue", "Grand Hotel");
        map.put("householdId", hid);

        String body = objectMapper.writeValueAsString(map);

        mockMvc.perform(post(invitationUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.greeting", containsString("Mr. and Mrs. Smith")));
    }

    @Test
    void createInvitation_shouldUseCustomGreeting() throws Exception {
        long hid = createHouseholdAndGetId(token, wid, "Friends Group", "FAMILY",
                "The Friends");

        Map<String, Object> map = new HashMap<>();
        map.put("templateId", "classic");
        map.put("name1", "Alice");
        map.put("name2", "Bob");
        map.put("eventDate", "2026-06-15");
        map.put("eventTime", "14:00:00");
        map.put("venue", "Grand Hotel");
        map.put("greeting", "Dear Friends");
        map.put("householdId", hid);

        String body = objectMapper.writeValueAsString(map);

        mockMvc.perform(post(invitationUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.greeting").value("Dear Friends"));
    }

    @Test
    void generate_shouldProducePdf() throws Exception {
        long hid = createHouseholdAndGetId(token, wid, "PDF Household", "INDIVIDUAL",
                "Mr. PDF");
        long invId = createInvitation(hid);

        mockMvc.perform(post(invitationUrl(invId) + "/generate")
                        .param("format", "PDF")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("GENERATED"))
                .andExpect(jsonPath("$.hasPdf").value(true));
    }

    @Test
    void generate_shouldProduceJpeg() throws Exception {
        long hid = createHouseholdAndGetId(token, wid, "JPEG Household", "INDIVIDUAL",
                "Mr. JPEG");
        long invId = createInvitation(hid);

        mockMvc.perform(post(invitationUrl(invId) + "/generate")
                        .param("format", "JPEG")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasJpeg").value(true));
    }

    @Test
    void listTemplates_shouldReturn4() throws Exception {
        mockMvc.perform(get(invitationUrl() + "/templates")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));
    }

    @Test
    void preview_shouldReturnPdfBytes() throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put("templateId", "classic");
        map.put("name1", "Alice");
        map.put("name2", "Bob");
        map.put("eventDate", "2026-06-15");
        map.put("eventTime", "14:00:00");
        map.put("venue", "Grand Hotel");
        map.put("greeting", "Dear Guest");

        String body = objectMapper.writeValueAsString(map);

        mockMvc.perform(post(invitationUrl() + "/preview")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void preview_shouldReturnJpegBytes() throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put("templateId", "classic");
        map.put("name1", "Alice");
        map.put("name2", "Bob");
        map.put("eventDate", "2026-06-15");
        map.put("eventTime", "14:00:00");
        map.put("venue", "Grand Hotel");
        map.put("greeting", "Dear Guest");

        String body = objectMapper.writeValueAsString(map);

        mockMvc.perform(post(invitationUrl() + "/preview")
                        .param("format", "JPEG")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG));
    }

    @Test
    void download_shouldReturn400IfNotGenerated() throws Exception {
        long hid = createHouseholdAndGetId(token, wid, "Draft Household", "INDIVIDUAL",
                "Mr. Draft");
        long invId = createInvitation(hid);

        mockMvc.perform(get(invitationUrl(invId) + "/download")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void generate_shouldReturn404ForNonexistent() throws Exception {
        mockMvc.perform(post(invitationUrl(99999) + "/generate")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void listInvitations_shouldReturnAll() throws Exception {
        long hid1 = createHouseholdAndGetId(token, wid, "List HH 1", "INDIVIDUAL",
                "Mr. One");
        long hid2 = createHouseholdAndGetId(token, wid, "List HH 2", "INDIVIDUAL",
                "Mr. Two");
        createInvitation(hid1);
        createInvitation(hid2);

        mockMvc.perform(get(invitationUrl())
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }
}
