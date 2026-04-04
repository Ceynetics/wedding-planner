package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.dto.request.InvitationRequest;
import pl.piomin.services.model.dto.response.InvitationResponse;
import pl.piomin.services.model.dto.response.TemplateResponse;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.Invitation;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.AddressStyle;
import pl.piomin.services.model.enums.InvitationStatus;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.repository.InvitationRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvitationServiceTest {

    @Mock private InvitationRepository invitationRepository;
    @Mock private HouseholdRepository householdRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;
    @Mock private InvitationPdfService pdfService;

    @InjectMocks
    private InvitationService invitationService;

    private Workspace testWorkspace;
    private Household testHousehold;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder().eventName("Wedding").build();
        testWorkspace.setId(1L);

        testHousehold = Household.builder()
                .householdName("The Smiths")
                .formalAddress("Mr. and Mrs. Robert Smith")
                .addressStyle(AddressStyle.COUPLE)
                .workspace(testWorkspace)
                .members(Collections.emptyList())
                .build();
        testHousehold.setId(1L);
    }

    @Test
    void create_shouldAutoPopulateGreetingFromHousehold() {
        InvitationRequest request = InvitationRequest.builder()
                .templateId("CLASSIC")
                .name1("Emma").name2("James")
                .eventDate(LocalDate.of(2026, 6, 15))
                .householdId(1L)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(householdRepository.findById(1L)).thenReturn(Optional.of(testHousehold));

        Invitation saved = Invitation.builder()
                .templateId("CLASSIC").name1("Emma").name2("James")
                .eventDate(LocalDate.of(2026, 6, 15))
                .greeting("Dear Mr. and Mrs. Robert Smith")
                .addressLine("Mr. and Mrs. Robert Smith")
                .status(InvitationStatus.DRAFT)
                .household(testHousehold).workspace(testWorkspace)
                .build();
        saved.setId(1L);

        when(invitationRepository.save(any(Invitation.class))).thenReturn(saved);

        InvitationResponse response = invitationService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Dear Mr. and Mrs. Robert Smith", response.getGreeting());
        assertEquals("Mr. and Mrs. Robert Smith", response.getAddressLine());
        assertEquals(1L, response.getHouseholdId());
    }

    @Test
    void create_shouldUseCustomGreetingWhenProvided() {
        InvitationRequest request = InvitationRequest.builder()
                .templateId("MODERN")
                .greeting("Dear Dr. and Rev. Williams")
                .addressLine("Dr. and Rev. Williams")
                .householdId(1L)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(householdRepository.findById(1L)).thenReturn(Optional.of(testHousehold));

        Invitation saved = Invitation.builder()
                .templateId("MODERN")
                .greeting("Dear Dr. and Rev. Williams")
                .addressLine("Dr. and Rev. Williams")
                .status(InvitationStatus.DRAFT)
                .household(testHousehold).workspace(testWorkspace)
                .build();
        saved.setId(2L);

        when(invitationRepository.save(any(Invitation.class))).thenReturn(saved);

        InvitationResponse response = invitationService.create(1L, request, 1L);

        assertEquals("Dear Dr. and Rev. Williams", response.getGreeting());
    }

    @Test
    void listTemplates_shouldReturnAllTemplates() {
        List<TemplateResponse> templates = invitationService.listTemplates();

        assertEquals(4, templates.size());
        assertTrue(templates.stream().anyMatch(t -> t.getId().equals("CLASSIC")));
        assertTrue(templates.stream().anyMatch(t -> t.getId().equals("MODERN")));
        assertTrue(templates.stream().anyMatch(t -> t.getId().equals("FLORAL")));
        assertTrue(templates.stream().anyMatch(t -> t.getId().equals("RUSTIC")));
    }
}
