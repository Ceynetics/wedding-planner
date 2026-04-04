package pl.piomin.services.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.request.TaskRequest;
import pl.piomin.services.model.dto.response.TaskResponse;
import pl.piomin.services.model.dto.response.TaskStatsResponse;
import pl.piomin.services.model.enums.TaskCategory;
import pl.piomin.services.model.enums.TaskPriority;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.TaskService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/tasks")
public class TaskController {

    private final TaskService taskService;
    private final SecurityUtils securityUtils;

    public TaskController(TaskService taskService, SecurityUtils securityUtils) {
        this.taskService = taskService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@CurrentUser UserDetails userDetails,
                                                @PathVariable Long workspaceId,
                                                @Valid @RequestBody TaskRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.create(workspaceId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> list(@CurrentUser UserDetails userDetails,
                                                    @PathVariable Long workspaceId,
                                                    @RequestParam(required = false) Boolean completed,
                                                    @RequestParam(required = false) TaskCategory category,
                                                    @RequestParam(required = false) TaskPriority priority) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(taskService.list(workspaceId, userId, completed, category, priority));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@CurrentUser UserDetails userDetails,
                                                 @PathVariable Long workspaceId,
                                                 @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(taskService.getById(workspaceId, id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@CurrentUser UserDetails userDetails,
                                                @PathVariable Long workspaceId,
                                                @PathVariable Long id,
                                                @Valid @RequestBody TaskRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(taskService.update(workspaceId, id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        taskService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskResponse> toggle(@CurrentUser UserDetails userDetails,
                                                @PathVariable Long workspaceId,
                                                @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(taskService.toggleComplete(workspaceId, id, userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<TaskStatsResponse> stats(@CurrentUser UserDetails userDetails,
                                                    @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(taskService.getStats(workspaceId, userId));
    }
}
