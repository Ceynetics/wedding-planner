package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.InvitationStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InvitationResponse {

    private Long id;
    private String templateId;
    private String name1;
    private String name2;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venue;
    private String selectedColor;
    private String greeting;
    private String addressLine;
    @JsonProperty("isVipGuest")
    private boolean isVipGuest;
    private InvitationStatus status;
    private Long householdId;
    private String householdName;
    @JsonProperty("hasPdf")
    private boolean hasPdf;
    @JsonProperty("hasJpeg")
    private boolean hasJpeg;
}
