package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationRequest {

    @Size(max = 20)
    private String templateId;

    @Size(max = 100)
    private String name1;

    @Size(max = 100)
    private String name2;

    private LocalDate eventDate;

    private LocalTime eventTime;

    @Size(max = 255)
    private String venue;

    @Size(max = 10)
    private String selectedColor;

    @Size(max = 200)
    private String greeting;

    @Size(max = 200)
    private String addressLine;

    private boolean isVipGuest;

    private Long householdId;
}
