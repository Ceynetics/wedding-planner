package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.TaskCategory;
import pl.piomin.services.model.enums.TaskPriority;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150)
    private String title;

    private LocalDate dueDate;

    private TaskCategory category;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    private boolean isCompleted;

    @Size(max = 500)
    private String notes;

    private Set<Long> assignedUserIds;
}
