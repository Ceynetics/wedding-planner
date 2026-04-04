package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.AddressStyle;
import pl.piomin.services.model.enums.GuestCategory;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 10)
    private String title;

    @NotNull(message = "Side is required")
    private GuestSide side;

    private GuestStatus status;

    private GuestCategory category;

    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String email;

    private Integer adults;

    private Integer children;

    @Size(max = 50)
    private String dietary;

    private boolean isVip;

    private boolean isHeadOfHousehold;

    @Size(max = 500)
    private String notes;

    private Long householdId;

    // For auto-creating a household when adding a solo/couple/family guest
    private AddressStyle newHouseholdStyle;

    @Size(max = 100)
    private String householdName;

    @Size(max = 200)
    private String formalAddress;
}
