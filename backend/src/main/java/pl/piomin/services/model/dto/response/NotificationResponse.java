package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.NotificationPriority;
import pl.piomin.services.model.enums.NotificationType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationResponse {

    private Long id;
    private String title;
    private String description;
    private NotificationType type;
    private NotificationPriority priority;
    private String actionUrl;
    private String imageUrl;
    @JsonProperty("isRead")
    private boolean isRead;
    private LocalDateTime createdAt;
}
