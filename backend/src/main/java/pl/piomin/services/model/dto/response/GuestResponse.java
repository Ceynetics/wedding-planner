package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.GuestCategory;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GuestResponse {

    private Long id;
    private String name;
    private String title;
    private String avatarUrl;
    private GuestSide side;
    private GuestStatus status;
    private GuestCategory category;
    private String phone;
    private String email;
    private Integer adults;
    private Integer children;
    private String dietary;
    @JsonProperty("isVip")
    private boolean isVip;
    @JsonProperty("isHeadOfHousehold")
    private boolean isHeadOfHousehold;
    private String notes;
    private Long householdId;
    private String householdName;
}
