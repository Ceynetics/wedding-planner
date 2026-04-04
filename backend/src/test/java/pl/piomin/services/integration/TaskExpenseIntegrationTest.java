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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TaskExpenseIntegrationTest extends BaseIntegrationTest {

    private String token;
    private long wid;

    @BeforeEach
    void setUp() throws Exception {
        String email = uniqueEmail();
        token = registerAndGetToken(email, "Password1!");
        wid = createWorkspaceAndGetId(token);
    }

    private MvcResult createTask(String title, String priority) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("title", title);
        body.put("priority", priority);
        return mockMvc.perform(post("/api/workspaces/{wid}/tasks", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
    }

    private MvcResult createExpense(String title, double amount, String category) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("title", title);
        body.put("amount", amount);
        body.put("category", category);
        return mockMvc.perform(post("/api/workspaces/{wid}/expenses", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
    }

    private long extractId(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();
    }

    // ---- Task Tests ----

    @Test
    void createTask_shouldReturn201() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("title", "Book Venue");
        body.put("priority", "HIGH");

        mockMvc.perform(post("/api/workspaces/{wid}/tasks", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void toggleTask_shouldFlipCompletion() throws Exception {
        long taskId = extractId(createTask("Toggle Task", "MEDIUM"));

        // First toggle: false -> true
        mockMvc.perform(patch("/api/workspaces/{wid}/tasks/{id}/toggle", wid, taskId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isCompleted").value(true));

        // Second toggle: true -> false
        mockMvc.perform(patch("/api/workspaces/{wid}/tasks/{id}/toggle", wid, taskId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isCompleted").value(false));
    }

    @Test
    void taskStats_shouldReflectCounts() throws Exception {
        createTask("Task 1", "HIGH");
        createTask("Task 2", "MEDIUM");
        long taskId3 = extractId(createTask("Task 3", "LOW"));

        // Toggle one task to completed
        mockMvc.perform(patch("/api/workspaces/{wid}/tasks/{id}/toggle", wid, taskId3)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/workspaces/{wid}/tasks/stats", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(3))
                .andExpect(jsonPath("$.completed").value(1))
                .andExpect(jsonPath("$.pending").value(2));
    }

    @Test
    void listTasks_shouldFilterByCompleted() throws Exception {
        createTask("Incomplete Task", "HIGH");
        long taskId = extractId(createTask("Complete Task", "MEDIUM"));

        mockMvc.perform(patch("/api/workspaces/{wid}/tasks/{id}/toggle", wid, taskId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/workspaces/{wid}/tasks", wid)
                        .header("Authorization", bearer(token))
                        .param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void deleteTask_shouldReturn204() throws Exception {
        long taskId = extractId(createTask("To Delete", "LOW"));

        mockMvc.perform(delete("/api/workspaces/{wid}/tasks/{id}", wid, taskId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/workspaces/{wid}/tasks/{id}", wid, taskId)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNotFound());
    }

    // ---- Expense Tests ----

    @Test
    void createExpense_shouldReturn201() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("title", "Venue");
        body.put("amount", 10000);
        body.put("category", "VENUE");

        mockMvc.perform(post("/api/workspaces/{wid}/expenses", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated());
    }

    @Test
    void budgetSummary_shouldCalculateCorrectly() throws Exception {
        // Workspace created with budget=50000 in BaseIntegrationTest
        createExpense("Venue Deposit", 10000, "VENUE");
        createExpense("Catering", 8000, "FOOD");

        mockMvc.perform(get("/api/workspaces/{wid}/expenses/summary", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalBudget").value(50000))
                .andExpect(jsonPath("$.totalSpent").value(18000))
                .andExpect(jsonPath("$.remaining").value(32000));
    }

    @Test
    void budgetSummary_shouldBreakdownByCategory() throws Exception {
        createExpense("Venue Booking", 15000, "VENUE");
        createExpense("Dinner Menu", 5000, "FOOD");

        mockMvc.perform(get("/api/workspaces/{wid}/expenses/summary", wid)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.byCategory.length()").value(2));
    }

    // ---- Validation Tests ----

    @Test
    void createTask_shouldReturn400ForMissingTitle() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("priority", "HIGH");

        mockMvc.perform(post("/api/workspaces/{wid}/tasks", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createTask_shouldReturn400ForMissingPriority() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("title", "Test");

        mockMvc.perform(post("/api/workspaces/{wid}/tasks", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createExpense_shouldReturn400ForNegativeAmount() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("title", "Test");
        body.put("amount", -100);

        mockMvc.perform(post("/api/workspaces/{wid}/expenses", wid)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    // ---- Cross-Workspace Security ----

    @Test
    void taskInOtherWorkspace_shouldReturn404() throws Exception {
        // User A creates a task in workspace 1
        long taskId = extractId(createTask("Private Task", "HIGH"));

        // User B registers and creates their own workspace
        String emailB = uniqueEmail();
        String tokenB = registerAndGetToken(emailB, "Password1!");
        long widB = createWorkspaceAndGetId(tokenB);

        // User B tries to access User A's task via their own workspace
        mockMvc.perform(get("/api/workspaces/{wid}/tasks/{id}", widB, taskId)
                        .header("Authorization", bearer(tokenB)))
                .andExpect(status().isNotFound());
    }
}
