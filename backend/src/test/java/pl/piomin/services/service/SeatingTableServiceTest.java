package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.exception.BadRequestException;
import pl.piomin.services.model.dto.request.PositionUpdateRequest;
import pl.piomin.services.model.dto.request.SeatingTableRequest;
import pl.piomin.services.model.dto.response.SeatingStatsResponse;
import pl.piomin.services.model.dto.response.SeatingTableResponse;
import pl.piomin.services.model.entity.Guest;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.SeatingTable;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.AddressStyle;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;
import pl.piomin.services.model.enums.TableShape;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.repository.SeatingTableRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SeatingTableServiceTest {

    @Mock private SeatingTableRepository tableRepository;
    @Mock private HouseholdRepository householdRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private SeatingTableService seatingTableService;

    private Workspace testWorkspace;
    private SeatingTable testTable;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder().eventName("Wedding").build();
        testWorkspace.setId(1L);

        testTable = SeatingTable.builder()
                .name("Head Table")
                .tableShape(TableShape.HEAD_TABLE)
                .chairCount(10)
                .isVip(true)
                .workspace(testWorkspace)
                .households(new ArrayList<>())
                .build();
        testTable.setId(1L);
    }

    @Test
    void create_shouldCreateTable() {
        SeatingTableRequest request = SeatingTableRequest.builder()
                .name("Head Table")
                .tableShape(TableShape.HEAD_TABLE)
                .chairCount(10)
                .isVip(true)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(tableRepository.save(any(SeatingTable.class))).thenReturn(testTable);

        SeatingTableResponse response = seatingTableService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Head Table", response.getName());
        assertEquals(TableShape.HEAD_TABLE, response.getTableShape());
        assertEquals(10, response.getChairCount());
    }

    @Test
    void updatePosition_shouldPersistCoordinates() {
        PositionUpdateRequest request = PositionUpdateRequest.builder()
                .positionX(245.5)
                .positionY(120.3)
                .rotation(45.0)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(tableRepository.findById(1L)).thenReturn(Optional.of(testTable));
        when(tableRepository.save(any(SeatingTable.class))).thenAnswer(inv -> inv.getArgument(0));

        SeatingTableResponse response = seatingTableService.updatePosition(1L, 1L, request, 1L);

        assertEquals(245.5, response.getPositionX());
        assertEquals(120.3, response.getPositionY());
        assertEquals(45.0, response.getRotation());
    }

    @Test
    void assignHouseholds_shouldAssignWhenCapacityAllows() {
        Guest g1 = Guest.builder().name("Robert").side(GuestSide.GROOM).status(GuestStatus.CONFIRMED)
                .adults(1).children(0).build();
        Guest g2 = Guest.builder().name("Jane").side(GuestSide.BRIDE).status(GuestStatus.CONFIRMED)
                .adults(1).children(0).build();

        Household household = Household.builder()
                .householdName("The Smiths")
                .addressStyle(AddressStyle.COUPLE)
                .workspace(testWorkspace)
                .members(List.of(g1, g2))
                .build();
        household.setId(10L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(tableRepository.findById(1L)).thenReturn(Optional.of(testTable));
        when(householdRepository.findAllById(List.of(10L))).thenReturn(List.of(household));

        SeatingTable updatedTable = SeatingTable.builder()
                .name("Head Table").tableShape(TableShape.HEAD_TABLE).chairCount(10)
                .workspace(testWorkspace).households(List.of(household)).build();
        updatedTable.setId(1L);
        when(tableRepository.findById(1L)).thenReturn(Optional.of(testTable), Optional.of(updatedTable));

        SeatingTableResponse response = seatingTableService.assignHouseholds(1L, 1L, List.of(10L), 1L);

        assertNotNull(response);
    }

    @Test
    void assignHouseholds_shouldThrowWhenCapacityExceeded() {
        // Table with only 2 chairs
        testTable.setChairCount(2);

        // Existing household already seated (2 members)
        Guest existing1 = Guest.builder().name("A").side(GuestSide.GROOM).status(GuestStatus.CONFIRMED)
                .adults(1).children(0).build();
        Guest existing2 = Guest.builder().name("B").side(GuestSide.BRIDE).status(GuestStatus.CONFIRMED)
                .adults(1).children(0).build();
        Household existingHousehold = Household.builder()
                .householdName("Existing").addressStyle(AddressStyle.COUPLE)
                .workspace(testWorkspace).members(List.of(existing1, existing2)).build();
        existingHousehold.setId(5L);
        testTable.setHouseholds(List.of(existingHousehold));

        // New household to assign (2 more members)
        Guest new1 = Guest.builder().name("C").side(GuestSide.GROOM).status(GuestStatus.CONFIRMED)
                .adults(1).children(1).build();
        Household newHousehold = Household.builder()
                .householdName("New").addressStyle(AddressStyle.INDIVIDUAL)
                .workspace(testWorkspace).members(List.of(new1)).build();
        newHousehold.setId(10L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(tableRepository.findById(1L)).thenReturn(Optional.of(testTable));
        when(householdRepository.findAllById(List.of(10L))).thenReturn(List.of(newHousehold));

        assertThrows(BadRequestException.class, () ->
                seatingTableService.assignHouseholds(1L, 1L, List.of(10L), 1L));
    }

    @Test
    void getStats_shouldReturnCorrectCounts() {
        Guest g1 = Guest.builder().name("A").side(GuestSide.GROOM).status(GuestStatus.CONFIRMED)
                .adults(2).children(1).build();
        Household h1 = Household.builder().householdName("H1").addressStyle(AddressStyle.FAMILY)
                .workspace(testWorkspace).members(List.of(g1)).build();
        h1.setId(1L);
        h1.setAssignedTable(testTable);

        Household h2 = Household.builder().householdName("H2").addressStyle(AddressStyle.INDIVIDUAL)
                .workspace(testWorkspace).members(Collections.emptyList()).build();
        h2.setId(2L);

        testTable.setHouseholds(List.of(h1));

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(tableRepository.findByWorkspaceId(1L)).thenReturn(List.of(testTable));
        when(householdRepository.findByWorkspaceId(1L)).thenReturn(List.of(h1, h2));

        SeatingStatsResponse stats = seatingTableService.getStats(1L, 1L);

        assertEquals(1, stats.getTotalTables());
        assertEquals(10, stats.getTotalChairs());
        assertEquals(3, stats.getFilledChairs()); // 2 adults + 1 child
        assertEquals(7, stats.getEmptyChairs());
        assertEquals(1, stats.getAssignedHouseholds());
        assertEquals(1, stats.getUnassignedHouseholds());
    }
}
