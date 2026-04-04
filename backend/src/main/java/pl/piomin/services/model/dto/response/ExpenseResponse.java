package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.ExpenseCategory;
import pl.piomin.services.model.enums.Payer;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExpenseResponse {

    private Long id;
    private String title;
    private BigDecimal amount;
    private ExpenseCategory category;
    private Payer paidBy;
    @JsonProperty("isPaid")
    private boolean isPaid;
    private boolean splitEnabled;
    private String notes;
    private LocalDate date;
}
