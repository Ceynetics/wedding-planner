package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.request.HouseholdRequest;
import pl.piomin.services.model.dto.response.HouseholdResponse;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.AddressStyle;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HouseholdServiceTest {

    @Mock private HouseholdRepository householdRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private HouseholdService householdService;

    private Workspace testWorkspace;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder().eventName("Wedding").build();
        testWorkspace.setId(1L);
    }

    @Test
    void create_shouldCreateHousehold() {
        HouseholdRequest request = HouseholdRequest.builder()
                .householdName("The Smiths")
                .addressStyle(AddressStyle.FAMILY)
                .formalAddress("The Smith Family")
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);

        Household saved = Household.builder()
                .householdName("The Smiths")
                .formalAddress("The Smith Family")
                .addressStyle(AddressStyle.FAMILY)
                .workspace(testWorkspace)
                .members(Collections.emptyList())
                .build();
        saved.setId(1L);

        when(householdRepository.save(any(Household.class))).thenReturn(saved);

        HouseholdResponse response = householdService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("The Smiths", response.getHouseholdName());
        assertEquals(AddressStyle.FAMILY, response.getAddressStyle());
    }

    @Test
    void create_shouldAutoGenerateFormalAddress() {
        HouseholdRequest request = HouseholdRequest.builder()
                .householdName("Johnson Household")
                .addressStyle(AddressStyle.COUPLE)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);

        Household saved = Household.builder()
                .householdName("Johnson Household")
                .formalAddress("Johnson Household")
                .addressStyle(AddressStyle.COUPLE)
                .workspace(testWorkspace)
                .members(Collections.emptyList())
                .build();
        saved.setId(1L);

        when(householdRepository.save(any(Household.class))).thenReturn(saved);

        HouseholdResponse response = householdService.create(1L, request, 1L);

        assertNotNull(response);
        assertNotNull(response.getFormalAddress());
    }

    @Test
    void listByWorkspace_shouldReturnHouseholds() {
        Household h1 = Household.builder()
                .householdName("The Smiths").addressStyle(AddressStyle.FAMILY)
                .workspace(testWorkspace).members(Collections.emptyList()).build();
        h1.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(householdRepository.findByWorkspaceId(1L)).thenReturn(List.of(h1));

        List<HouseholdResponse> result = householdService.listByWorkspace(1L, 1L);

        assertEquals(1, result.size());
    }

    @Test
    void delete_shouldThrowWhenNotFound() {
        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(householdRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> householdService.delete(1L, 99L, 1L));
    }

    @Test
    void getUnassigned_shouldReturnHouseholdsWithNoTable() {
        Household h = Household.builder()
                .householdName("Solo Guest").addressStyle(AddressStyle.INDIVIDUAL)
                .workspace(testWorkspace).members(Collections.emptyList()).build();
        h.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(householdRepository.findByWorkspaceIdAndAssignedTableIsNull(1L)).thenReturn(List.of(h));

        List<HouseholdResponse> result = householdService.getUnassigned(1L, 1L);

        assertEquals(1, result.size());
    }
}
