package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.TableShape;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SeatingTableResponse {

    private Long id;
    private String name;
    private TableShape tableShape;
    private Integer chairCount;
    private Double positionX;
    private Double positionY;
    private Double rotation;
    @JsonProperty("isVip")
    private boolean isVip;
    private int seatedCount;
    private int householdCount;
    private List<HouseholdResponse> households;
}
