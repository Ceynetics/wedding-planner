package pl.piomin.services.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.response.CalendarEventResponse;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.CalendarService;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final SecurityUtils securityUtils;

    public CalendarController(CalendarService calendarService, SecurityUtils securityUtils) {
        this.calendarService = calendarService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEventResponse>> getEvents(@CurrentUser UserDetails userDetails,
                                                                   @PathVariable Long workspaceId,
                                                                   @RequestParam String month) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        YearMonth yearMonth = YearMonth.parse(month);
        return ResponseEntity.ok(calendarService.getEventsForMonth(workspaceId, yearMonth, userId));
    }
}
