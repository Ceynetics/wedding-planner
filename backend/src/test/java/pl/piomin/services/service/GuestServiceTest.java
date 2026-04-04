package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.dto.request.GuestRequest;
import pl.piomin.services.model.dto.response.GuestResponse;
import pl.piomin.services.model.dto.response.GuestStatsResponse;
import pl.piomin.services.model.entity.Guest;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.AddressStyle;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;
import pl.piomin.services.repository.GuestRepository;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GuestServiceTest {

    @Mock private GuestRepository guestRepository;
    @Mock private HouseholdRepository householdRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private GuestService guestService;

    private Workspace testWorkspace;
    private Household testHousehold;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder().eventName("Wedding").build();
        testWorkspace.setId(1L);

        testHousehold = Household.builder()
                .householdName("Robert Smith")
                .formalAddress("Mr. Robert Smith")
                .addressStyle(AddressStyle.INDIVIDUAL)
                .workspace(testWorkspace)
                .members(Collections.emptyList())
                .build();
        testHousehold.setId(1L);
    }

    @Test
    void create_shouldCreateGuestWithAutoHousehold() {
        GuestRequest request = GuestRequest.builder()
                .name("Robert Smith")
                .title("Mr.")
                .side(GuestSide.GROOM)
                .isHeadOfHousehold(true)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(householdRepository.save(any(Household.class))).thenReturn(testHousehold);

        Guest saved = Guest.builder()
                .name("Robert Smith").title("Mr.").side(GuestSide.GROOM)
                .status(GuestStatus.PENDING).adults(1).children(0)
                .isHeadOfHousehold(true).household(testHousehold).workspace(testWorkspace)
                .build();
        saved.setId(1L);

        when(guestRepository.save(any(Guest.class))).thenReturn(saved);

        GuestResponse response = guestService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Robert Smith", response.getName());
        assertEquals(GuestSide.GROOM, response.getSide());
        assertEquals(1L, response.getHouseholdId());
    }

    @Test
    void create_shouldUseExistingHousehold() {
        GuestRequest request = GuestRequest.builder()
                .name("Jane Smith")
                .side(GuestSide.BRIDE)
                .householdId(1L)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(householdRepository.findById(1L)).thenReturn(Optional.of(testHousehold));

        Guest saved = Guest.builder()
                .name("Jane Smith").side(GuestSide.BRIDE).status(GuestStatus.PENDING)
                .adults(1).children(0).household(testHousehold).workspace(testWorkspace)
                .build();
        saved.setId(2L);

        when(guestRepository.save(any(Guest.class))).thenReturn(saved);

        GuestResponse response = guestService.create(1L, request, 1L);

        assertEquals("Jane Smith", response.getName());
        assertEquals(1L, response.getHouseholdId());
    }

    @Test
    void getStats_shouldReturnCorrectCounts() {
        Guest g1 = Guest.builder().status(GuestStatus.CONFIRMED).adults(2).children(1)
                .isVip(true).household(testHousehold).workspace(testWorkspace).build();
        g1.setId(1L);
        Guest g2 = Guest.builder().status(GuestStatus.PENDING).adults(1).children(0)
                .household(testHousehold).workspace(testWorkspace).build();
        g2.setId(2L);
        Guest g3 = Guest.builder().status(GuestStatus.NOT_INVITED).adults(1).children(2)
                .workspace(testWorkspace).build();
        g3.setId(3L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(guestRepository.findByWorkspaceId(1L)).thenReturn(List.of(g1, g2, g3));

        GuestStatsResponse stats = guestService.getStats(1L, 1L);

        assertEquals(3, stats.getTotal());
        assertEquals(1, stats.getConfirmed());
        assertEquals(1, stats.getPending());
        assertEquals(1, stats.getNotInvited());
        assertEquals(1, stats.getVipCount());
        assertEquals(4, stats.getTotalAdults());
        assertEquals(3, stats.getTotalChildren());
    }

    @Test
    void create_shouldAutoGenerateFamilyFormalAddress() {
        GuestRequest request = GuestRequest.builder()
                .name("Robert Johnson")
                .title("Mr.")
                .side(GuestSide.GROOM)
                .newHouseholdStyle(AddressStyle.FAMILY)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);

        Household familyHousehold = Household.builder()
                .householdName("Robert Johnson")
                .formalAddress("The Johnson Family")
                .addressStyle(AddressStyle.FAMILY)
                .workspace(testWorkspace)
                .members(Collections.emptyList())
                .build();
        familyHousehold.setId(2L);

        when(householdRepository.save(any(Household.class))).thenReturn(familyHousehold);

        Guest saved = Guest.builder()
                .name("Robert Johnson").side(GuestSide.GROOM).status(GuestStatus.PENDING)
                .adults(1).children(0).household(familyHousehold).workspace(testWorkspace)
                .build();
        saved.setId(1L);

        when(guestRepository.save(any(Guest.class))).thenReturn(saved);

        GuestResponse response = guestService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Robert Johnson", response.getHouseholdName());
    }
}
