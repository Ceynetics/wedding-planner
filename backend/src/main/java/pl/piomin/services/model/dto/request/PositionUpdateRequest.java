package pl.piomin.services.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionUpdateRequest {

    private Double positionX;
    private Double positionY;
    private Double rotation;
}
