package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.TableShape;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatingTableRequest {

    @NotBlank(message = "Table name is required")
    @Size(max = 50)
    private String name;

    private TableShape tableShape;

    @Positive(message = "Chair count must be positive")
    private Integer chairCount;

    private boolean isVip;
}
