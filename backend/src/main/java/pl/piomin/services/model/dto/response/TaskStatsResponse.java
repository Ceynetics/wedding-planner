package pl.piomin.services.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatsResponse {

    private long total;
    private long completed;
    private long pending;
    private Map<String, Long> byCategory;
    private Map<String, Long> byPriority;
}
