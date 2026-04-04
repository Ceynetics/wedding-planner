package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdAssignRequest {

    @NotEmpty(message = "At least one household ID is required")
    private List<Long> householdIds;
}
