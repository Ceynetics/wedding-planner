package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.TaskCategory;
import pl.piomin.services.model.enums.TaskPriority;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskResponse {

    private Long id;
    private String title;
    private LocalDate dueDate;
    private TaskCategory category;
    private TaskPriority priority;
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    private String notes;
    private List<AssignedUserResponse> assignedUsers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignedUserResponse {
        private Long id;
        private String fullName;
        private String avatarUrl;
    }
}
