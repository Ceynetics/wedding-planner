package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WorkspaceResponse {

    private Long id;
    private String eventName;
    private LocalDate eventDate;
    private String venue;
    private BigDecimal budget;
    private String pairingCode;
    private List<MemberResponse> members;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberResponse {
        private Long userId;
        private String fullName;
        private String email;
        private String avatarUrl;
        private String role;
    }
}
