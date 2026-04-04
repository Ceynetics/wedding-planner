package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.VendorCategory;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VendorResponse {

    private Long id;
    private String name;
    private VendorCategory category;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    private BigDecimal price;
    private String description;
    private String address;
    private String email;
    private String phone;
    private List<String> services;
}
