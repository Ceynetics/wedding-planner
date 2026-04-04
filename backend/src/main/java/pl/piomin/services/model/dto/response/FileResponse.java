package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.FileFolder;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileResponse {

    private Long id;
    private String name;
    private String module;
    private Long size;
    private FileFolder folder;
    private String contentType;
    private LocalDateTime createdAt;
}
