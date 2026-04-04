package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.request.TaskRequest;
import pl.piomin.services.model.dto.response.TaskResponse;
import pl.piomin.services.model.dto.response.TaskStatsResponse;
import pl.piomin.services.model.entity.Task;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.TaskCategory;
import pl.piomin.services.model.enums.TaskPriority;
import pl.piomin.services.repository.TaskRepository;
import pl.piomin.services.repository.UserRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
                       WorkspaceAuthorizationService authorizationService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public TaskResponse create(Long workspaceId, TaskRequest request, Long userId) {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        Set<User> assignedUsers = resolveAssignedUsers(request.getAssignedUserIds());

        Task task = Task.builder()
                .title(request.getTitle())
                .dueDate(request.getDueDate())
                .category(request.getCategory())
                .priority(request.getPriority())
                .isCompleted(request.isCompleted())
                .notes(request.getNotes())
                .assignedUsers(assignedUsers)
                .workspace(workspace)
                .build();

        task = taskRepository.save(task);
        log.info("Task created: id={}, workspaceId={}, title={}", task.getId(), workspaceId, task.getTitle());
        return toResponse(task);
    }

    public List<TaskResponse> list(Long workspaceId, Long userId,
                                    Boolean completed, TaskCategory category,
                                    TaskPriority priority) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Listing tasks: workspaceId={}, completed={}, category={}, priority={}", workspaceId, completed, category, priority);

        Specification<Task> spec = (root, query, cb) -> cb.equal(root.get("workspace").get("id"), workspaceId);

        if (completed != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isCompleted"), completed));
        }
        if (category != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }
        if (priority != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), priority));
        }

        return taskRepository.findAll(spec).stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse getById(Long workspaceId, Long taskId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Task task = findTaskInWorkspace(workspaceId, taskId);
        return toResponse(task);
    }

    @Transactional
    public TaskResponse update(Long workspaceId, Long taskId, TaskRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Task task = findTaskInWorkspace(workspaceId, taskId);

        task.setTitle(request.getTitle());
        task.setDueDate(request.getDueDate());
        task.setCategory(request.getCategory());
        task.setPriority(request.getPriority());
        task.setCompleted(request.isCompleted());
        task.setNotes(request.getNotes());

        if (request.getAssignedUserIds() != null) {
            task.setAssignedUsers(resolveAssignedUsers(request.getAssignedUserIds()));
        }

        task = taskRepository.save(task);
        log.info("Task updated: id={}, workspaceId={}", task.getId(), workspaceId);
        return toResponse(task);
    }

    @Transactional
    public void delete(Long workspaceId, Long taskId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Task task = findTaskInWorkspace(workspaceId, taskId);
        taskRepository.delete(task);
        log.info("Task deleted: id={}, workspaceId={}", taskId, workspaceId);
    }

    @Transactional
    public TaskResponse toggleComplete(Long workspaceId, Long taskId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Task task = findTaskInWorkspace(workspaceId, taskId);
        task.setCompleted(!task.isCompleted());
        task = taskRepository.save(task);
        log.info("Task toggled: id={}, isCompleted={}", task.getId(), task.isCompleted());
        return toResponse(task);
    }

    public TaskStatsResponse getStats(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Fetching task stats: workspaceId={}", workspaceId);

        List<Task> tasks = taskRepository.findByWorkspaceId(workspaceId);

        Map<String, Long> byCategory = tasks.stream()
                .filter(t -> t.getCategory() != null)
                .collect(Collectors.groupingBy(t -> t.getCategory().name(), Collectors.counting()));

        Map<String, Long> byPriority = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getPriority().name(), Collectors.counting()));

        return TaskStatsResponse.builder()
                .total(tasks.size())
                .completed(tasks.stream().filter(Task::isCompleted).count())
                .pending(tasks.stream().filter(t -> !t.isCompleted()).count())
                .byCategory(byCategory)
                .byPriority(byPriority)
                .build();
    }

    private Set<User> resolveAssignedUsers(Set<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) return new HashSet<>();
        return new HashSet<>(userRepository.findAllById(userIds));
    }

    private Task findTaskInWorkspace(Long workspaceId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Task not found in this workspace");
        }
        return task;
    }

    private TaskResponse toResponse(Task task) {
        List<TaskResponse.AssignedUserResponse> assignedUsers = task.getAssignedUsers().stream()
                .map(u -> TaskResponse.AssignedUserResponse.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .avatarUrl(u.getAvatarUrl())
                        .build())
                .toList();

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .dueDate(task.getDueDate())
                .category(task.getCategory())
                .priority(task.getPriority())
                .isCompleted(task.isCompleted())
                .notes(task.getNotes())
                .assignedUsers(assignedUsers)
                .build();
    }
}
