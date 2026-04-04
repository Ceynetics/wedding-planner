package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceRegistrationRequest {

    @NotBlank(message = "FCM token is required")
    private String fcmToken;

    @NotBlank(message = "Device type is required")
    private String deviceType;

    private String deviceName;
}
