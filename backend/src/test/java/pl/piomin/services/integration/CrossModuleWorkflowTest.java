package pl.piomin.services.integration;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import pl.piomin.services.repository.NotificationRepository;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CrossModuleWorkflowTest extends BaseIntegrationTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Test
    void fullWeddingPlanningWorkflow() throws Exception {
        // 1. Register and create workspace
        String email = uniqueEmail();
        String token = registerAndGetToken(email, "Password123");
        long wid = createWorkspaceAndGetId(token);

        // 2. Create households (individual + couple + family)
        long individualHid = createHousehold(token, wid, "Sarah Johnson", "INDIVIDUAL", "Ms. Sarah Johnson");
        long coupleHid = createHousehold(token, wid, "The Smiths", "COUPLE", "Mr. and Mrs. Robert Smith");
        long familyHid = createHousehold(token, wid, "The Williams Family", "FAMILY", "The Williams Family");

        // 3. Add guests to households
        createGuestInHousehold(token, wid, "Sarah Johnson", "BRIDE", individualHid, 1, 0);
        createGuestInHousehold(token, wid, "Robert Smith", "GROOM", coupleHid, 1, 0);
        createGuestInHousehold(token, wid, "Jane Smith", "BRIDE", coupleHid, 1, 0);
        createGuestInHousehold(token, wid, "Tom Williams", "GROOM", familyHid, 2, 3);

        // 4. Verify guest stats
        mockMvc.perform(get("/api/workspaces/{wid}/guests/stats", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(4));

        // 5. Create tasks
        createTask(token, wid, "Book Venue", "HIGH", "VENUE");
        createTask(token, wid, "Order Flowers", "MEDIUM", "FLOWERS");

        // 6. Create expenses
        createExpense(token, wid, "Venue Deposit", 10000, "VENUE");
        createExpense(token, wid, "Catering", 8000, "FOOD");

        // 7. Verify budget summary
        mockMvc.perform(get("/api/workspaces/{wid}/expenses/summary", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSpent").value(18000))
                .andExpect(jsonPath("$.remaining").value(32000));

        // 8. Create seating tables and assign households
        long tableId = createTable(token, wid, "Head Table", 10);

        mockMvc.perform(post("/api/workspaces/{wid}/seating-tables/{tid}/households", wid, tableId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("householdIds", new long[]{coupleHid, familyHid}))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.householdCount").value(2));

        // 9. Verify seating stats
        mockMvc.perform(get("/api/workspaces/{wid}/seating-tables/stats", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTables").value(1))
                .andExpect(jsonPath("$.assignedHouseholds").value(2))
                .andExpect(jsonPath("$.unassignedHouseholds").value(1));

        // 10. Create invitation for the couple household
        long invId = createInvitation(token, wid, coupleHid);

        // 11. Generate PDF
        mockMvc.perform(post("/api/workspaces/{wid}/invitations/{iid}/generate", wid, invId)
                        .header("Authorization", bearer(token))
                        .param("format", "PDF"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasPdf").value(true))
                .andExpect(jsonPath("$.status").value("GENERATED"));
    }

    @Test
    void multiUserCollaboration() throws Exception {
        // User A registers and creates workspace
        String emailA = uniqueEmail();
        String tokenA = registerAndGetToken(emailA, "Password123");
        long wid = createWorkspaceAndGetId(tokenA);

        // Get pairing code
        MvcResult wsResult = mockMvc.perform(get("/api/workspaces/{wid}", wid)
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isOk())
                .andReturn();
        String pairingCode = objectMapper.readTree(wsResult.getResponse().getContentAsString())
                .get("pairingCode").asText();

        // User B registers and joins via code
        String emailB = uniqueEmail();
        String tokenB = registerAndGetToken(emailB, "Password123");

        mockMvc.perform(post("/api/workspaces/join")
                        .header("Authorization", bearer(tokenB))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("pairingCode", pairingCode))))
                .andExpect(status().isOk());

        // Both can create guests
        createGuestDirect(tokenA, wid, "Guest by A", "BRIDE");
        createGuestDirect(tokenB, wid, "Guest by B", "GROOM");

        // Both see all guests
        mockMvc.perform(get("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(tokenB)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        // User B can view workspace
        mockMvc.perform(get("/api/workspaces/{wid}", wid)
                        .header("Authorization", bearer(tokenB)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.members", hasSize(2)));
    }

    @Test
    void calendarAggregation() throws Exception {
        String token = registerAndGetToken(uniqueEmail(), "Password123");

        // Create workspace with event date in June
        String wsBody = objectMapper.writeValueAsString(Map.of(
                "eventName", "June Wedding", "eventDate", "2026-06-30",
                "venue", "Garden", "budget", 50000));
        MvcResult wsResult = mockMvc.perform(post("/api/workspaces")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(wsBody))
                .andExpect(status().isCreated())
                .andReturn();
        long wid = objectMapper.readTree(wsResult.getResponse().getContentAsString()).get("id").asLong();

        // Create task due June 10
        mockMvc.perform(post("/api/workspaces/{wid}/tasks", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "title", "Final Fitting", "priority", "HIGH", "dueDate", "2026-06-10"))))
                .andExpect(status().isCreated());

        // Create expense due June 15
        mockMvc.perform(post("/api/workspaces/{wid}/expenses", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "title", "Venue Deposit", "amount", 5000, "date", "2026-06-15"))))
                .andExpect(status().isCreated());

        // Get calendar for June
        mockMvc.perform(get("/api/workspaces/{wid}/calendar", wid)
                        .header("Authorization", bearer(token))
                        .param("month", "2026-06"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))  // task + expense + wedding day
                .andExpect(jsonPath("$[0].date").value("2026-06-10"))
                .andExpect(jsonPath("$[0].type").value("task"))
                .andExpect(jsonPath("$[1].date").value("2026-06-15"))
                .andExpect(jsonPath("$[1].type").value("payment"))
                .andExpect(jsonPath("$[2].date").value("2026-06-30"))
                .andExpect(jsonPath("$[2].title").value("Wedding Day!"));
    }

    @Test
    void notificationWorkflow() throws Exception {
        String token = registerAndGetToken(uniqueEmail(), "Password123");
        long wid = createWorkspaceAndGetId(token);

        // Verify initially no notifications
        mockMvc.perform(get("/api/workspaces/{wid}/notifications/unread-count", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(0));

        // List notifications (empty)
        mockMvc.perform(get("/api/workspaces/{wid}/notifications", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void guestToInvitationPipeline() throws Exception {
        String token = registerAndGetToken(uniqueEmail(), "Password123");
        long wid = createWorkspaceAndGetId(token);

        // Create guest with COUPLE household style
        String guestBody = objectMapper.writeValueAsString(Map.of(
                "name", "Robert Smith", "title", "Mr.", "side", "GROOM",
                "newHouseholdStyle", "COUPLE", "householdName", "The Smiths",
                "formalAddress", "Mr. and Mrs. Robert Smith"));
        MvcResult guestResult = mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(guestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.householdId").isNotEmpty())
                .andReturn();

        long householdId = objectMapper.readTree(guestResult.getResponse().getContentAsString())
                .get("householdId").asLong();

        // Verify household formal address
        mockMvc.perform(get("/api/workspaces/{wid}/households/{hid}", wid, householdId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.formalAddress").value("Mr. and Mrs. Robert Smith"));

        // Create invitation linked to household
        long invId = createInvitation(token, wid, householdId);

        // Verify invitation greeting matches household formalAddress
        mockMvc.perform(get("/api/workspaces/{wid}/invitations/{iid}", wid, invId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.greeting").value(containsString("Mr. and Mrs. Robert Smith")))
                .andExpect(jsonPath("$.householdId").value(householdId));

        // Generate PDF
        mockMvc.perform(post("/api/workspaces/{wid}/invitations/{iid}/generate", wid, invId)
                        .header("Authorization", bearer(token))
                        .param("format", "PDF"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasPdf").value(true));
    }

    @Test
    void seatingCapacityEnforcement() throws Exception {
        String token = registerAndGetToken(uniqueEmail(), "Password123");
        long wid = createWorkspaceAndGetId(token);

        // Create table with 8 chairs
        long tableId = createTable(token, wid, "Table 1", 8);

        // Create household A (3 members: 2 adults + 1 child)
        long hidA = createHousehold(token, wid, "Household A", "FAMILY", "The A Family");
        createGuestInHousehold(token, wid, "Parent A", "BRIDE", hidA, 2, 1);

        // Create household B (3 members: 2 adults + 1 child)
        long hidB = createHousehold(token, wid, "Household B", "FAMILY", "The B Family");
        createGuestInHousehold(token, wid, "Parent B", "GROOM", hidB, 2, 1);

        // Assign A (3 seats used of 8) -> OK
        mockMvc.perform(post("/api/workspaces/{wid}/seating-tables/{tid}/households", wid, tableId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("householdIds", new long[]{hidA}))))
                .andExpect(status().isOk());

        // Assign B (3 more = 6 total, still under 8) -> OK
        mockMvc.perform(post("/api/workspaces/{wid}/seating-tables/{tid}/households", wid, tableId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("householdIds", new long[]{hidB}))))
                .andExpect(status().isOk());

        // Create household C (4 members: 3 adults + 1 child)
        long hidC = createHousehold(token, wid, "Household C", "FAMILY", "The C Family");
        createGuestInHousehold(token, wid, "Parent C", "BRIDE", hidC, 3, 1);

        // Assign C (4 more = 10 total, exceeds 8) -> 400
        mockMvc.perform(post("/api/workspaces/{wid}/seating-tables/{tid}/households", wid, tableId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("householdIds", new long[]{hidC}))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("chairs")));
    }

    // ---- Helper methods ----

    private long createHousehold(String token, long wid, String name, String style, String formalAddress) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/workspaces/{wid}/households", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "householdName", name, "addressStyle", style, "formalAddress", formalAddress))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }

    private void createGuestInHousehold(String token, long wid, String name, String side, long householdId, int adults, int children) throws Exception {
        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", name, "side", side, "householdId", householdId,
                                "adults", adults, "children", children))))
                .andExpect(status().isCreated());
    }

    private void createGuestDirect(String token, long wid, String name, String side) throws Exception {
        mockMvc.perform(post("/api/workspaces/{wid}/guests", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", name, "side", side, "newHouseholdStyle", "INDIVIDUAL"))))
                .andExpect(status().isCreated());
    }

    private long createTable(String token, long wid, String name, int chairs) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/workspaces/{wid}/seating-tables", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", name, "tableShape", "ROUND", "chairCount", chairs))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }

    private void createTask(String token, long wid, String title, String priority, String category) throws Exception {
        mockMvc.perform(post("/api/workspaces/{wid}/tasks", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "title", title, "priority", priority, "category", category))))
                .andExpect(status().isCreated());
    }

    private void createExpense(String token, long wid, String title, int amount, String category) throws Exception {
        mockMvc.perform(post("/api/workspaces/{wid}/expenses", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "title", title, "amount", amount, "category", category))))
                .andExpect(status().isCreated());
    }

    private long createInvitation(String token, long wid, long householdId) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/workspaces/{wid}/invitations", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "templateId", "CLASSIC", "name1", "Emma", "name2", "James",
                                "eventDate", "2026-06-15", "venue", "Grand Hotel",
                                "householdId", householdId))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }
}
