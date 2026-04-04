package pl.piomin.services.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatingStatsResponse {

    private int totalTables;
    private int totalChairs;
    private int filledChairs;
    private int emptyChairs;
    private int assignedHouseholds;
    private int unassignedHouseholds;
}
