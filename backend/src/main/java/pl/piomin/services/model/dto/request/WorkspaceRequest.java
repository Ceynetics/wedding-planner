package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceRequest {

    @NotBlank(message = "Event name is required")
    @Size(max = 100)
    private String eventName;

    private LocalDate eventDate;

    @Size(max = 255)
    private String venue;

    private BigDecimal budget;
}
