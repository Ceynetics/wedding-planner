package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.AddressStyle;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HouseholdResponse {

    private Long id;
    private String householdName;
    private String formalAddress;
    private AddressStyle addressStyle;
    private Long headGuestId;
    private Long assignedTableId;
    private String assignedTableName;
    private RsvpSummary rsvpSummary;
    private List<GuestResponse> members;
    private Integer totalMembers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RsvpSummary {
        private int total;
        private int confirmed;
        private int pending;
        private int declined;
    }
}
