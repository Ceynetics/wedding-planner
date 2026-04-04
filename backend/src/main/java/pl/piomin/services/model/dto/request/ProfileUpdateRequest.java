package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.Gender;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {

    @Size(max = 100)
    private String fullName;

    private Integer age;

    private Gender gender;

    @Size(max = 20)
    private String phone;

    @Size(max = 500)
    private String bio;

    @Size(max = 500)
    private String avatarUrl;
}
