package pl.piomin.services.integration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class VendorIntegrationTest extends BaseIntegrationTest {

    private String token;
    private long wid;

    @BeforeEach
    void setUp() throws Exception {
        String email = uniqueEmail();
        token = registerAndGetToken(email, "Password123");
        wid = createWorkspaceAndGetId(token);
    }

    private String hiredVendorUrl() {
        return "/api/workspaces/" + wid + "/vendors";
    }

    @Test
    void listVendors_shouldReturnPaginated() throws Exception {
        mockMvc.perform(get("/api/vendors")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", is(not(empty()))));
    }

    @Test
    void listVendors_shouldFilterByCategory() throws Exception {
        mockMvc.perform(get("/api/vendors")
                        .param("category", "PHOTOGRAPHY")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].category", everyItem(is("PHOTOGRAPHY"))));
    }

    @Test
    void listVendors_shouldSearchByName() throws Exception {
        mockMvc.perform(get("/api/vendors")
                        .param("search", "Lumina")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name", containsStringIgnoringCase("Lumina")));
    }

    @Test
    void vendorDetail_shouldIncludeServices() throws Exception {
        mockMvc.perform(get("/api/vendors/1")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.services").isArray())
                .andExpect(jsonPath("$.services", is(not(empty()))));
    }

    @Test
    void createHiredVendor_shouldReturn201() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "vendorName", "My Vendor",
                "category", "VENUE"
        ));

        mockMvc.perform(post(hiredVendorUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.vendorName").value("My Vendor"));
    }

    @Test
    void deleteHiredVendor_shouldReturn204() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "vendorName", "Temp Vendor",
                "category", "CATERING"
        ));

        MvcResult result = mockMvc.perform(post(hiredVendorUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        long vendorId = json.get("id").asLong();

        mockMvc.perform(delete(hiredVendorUrl() + "/" + vendorId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
    }

    @Test
    void listVendors_shouldRequireAuth() throws Exception {
        mockMvc.perform(get("/api/vendors"))
                .andExpect(status().isForbidden());
    }

    @Test
    void createHiredVendor_shouldReturn400ForMissingName() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "category", "VENUE"
        ));

        mockMvc.perform(post(hiredVendorUrl())
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
