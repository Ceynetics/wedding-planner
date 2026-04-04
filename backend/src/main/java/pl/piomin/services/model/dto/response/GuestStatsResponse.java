package pl.piomin.services.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestStatsResponse {

    private long total;
    private long confirmed;
    private long pending;
    private long notInvited;
    private long vipCount;
    private long totalAdults;
    private long totalChildren;
    private long totalHouseholds;
}
