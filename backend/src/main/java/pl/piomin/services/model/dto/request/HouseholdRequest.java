package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.AddressStyle;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdRequest {

    @NotBlank(message = "Household name is required")
    @Size(max = 100)
    private String householdName;

    @Size(max = 200)
    private String formalAddress;

    @NotNull(message = "Address style is required")
    private AddressStyle addressStyle;
}
