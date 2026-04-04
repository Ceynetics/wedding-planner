package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.BadRequestException;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.mapper.EntityMapper;
import pl.piomin.services.model.dto.request.PositionUpdateRequest;
import pl.piomin.services.model.dto.request.SeatingTableRequest;
import pl.piomin.services.model.dto.response.HouseholdResponse;
import pl.piomin.services.model.dto.response.SeatingStatsResponse;
import pl.piomin.services.model.dto.response.SeatingTableResponse;
import pl.piomin.services.model.entity.Guest;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.SeatingTable;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.repository.SeatingTableRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.Collections;
import java.util.List;

@Service
public class SeatingTableService {

    private static final Logger log = LoggerFactory.getLogger(SeatingTableService.class);

    private final SeatingTableRepository tableRepository;
    private final HouseholdRepository householdRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public SeatingTableService(SeatingTableRepository tableRepository,
                               HouseholdRepository householdRepository,
                               WorkspaceAuthorizationService authorizationService) {
        this.tableRepository = tableRepository;
        this.householdRepository = householdRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public SeatingTableResponse create(Long workspaceId, SeatingTableRequest request, Long userId) {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        SeatingTable table = SeatingTable.builder()
                .name(request.getName())
                .tableShape(request.getTableShape())
                .chairCount(request.getChairCount())
                .isVip(request.isVip())
                .workspace(workspace)
                .build();

        table = tableRepository.save(table);
        log.info("Seating table created: id={}, workspaceId={}, name={}", table.getId(), workspaceId, table.getName());
        return toResponse(table);
    }

    public List<SeatingTableResponse> list(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Listing seating tables: workspaceId={}", workspaceId);
        return tableRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public SeatingTableResponse getById(Long workspaceId, Long tableId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        SeatingTable table = findTableInWorkspace(workspaceId, tableId);
        return toResponse(table);
    }

    @Transactional
    public SeatingTableResponse update(Long workspaceId, Long tableId, SeatingTableRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        SeatingTable table = findTableInWorkspace(workspaceId, tableId);

        table.setName(request.getName());
        table.setTableShape(request.getTableShape());
        table.setChairCount(request.getChairCount());
        table.setVip(request.isVip());

        table = tableRepository.save(table);
        log.info("Seating table updated: id={}, workspaceId={}", table.getId(), workspaceId);
        return toResponse(table);
    }

    @Transactional
    public void delete(Long workspaceId, Long tableId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        SeatingTable table = findTableInWorkspace(workspaceId, tableId);

        // Unassign all households before deleting
        for (Household h : table.getHouseholds()) {
            h.setAssignedTable(null);
            householdRepository.save(h);
        }

        tableRepository.delete(table);
        log.info("Seating table deleted: id={}, workspaceId={}", tableId, workspaceId);
    }

    @Transactional
    public SeatingTableResponse updatePosition(Long workspaceId, Long tableId,
                                                PositionUpdateRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        SeatingTable table = findTableInWorkspace(workspaceId, tableId);

        if (request.getPositionX() != null) table.setPositionX(request.getPositionX());
        if (request.getPositionY() != null) table.setPositionY(request.getPositionY());
        if (request.getRotation() != null) table.setRotation(request.getRotation());

        table = tableRepository.save(table);
        log.debug("Table position updated: id={}, x={}, y={}, rotation={}", tableId, request.getPositionX(), request.getPositionY(), request.getRotation());
        return toResponse(table);
    }

    @Transactional
    public SeatingTableResponse assignHouseholds(Long workspaceId, Long tableId,
                                                  List<Long> householdIds, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        SeatingTable table = findTableInWorkspace(workspaceId, tableId);

        List<Household> householdsToAssign = householdRepository.findAllById(householdIds);
        if (householdsToAssign.size() != householdIds.size()) {
            throw new ResourceNotFoundException("One or more households not found");
        }

        // Calculate new total seated count
        int currentSeated = calculateSeatedCount(table);
        int newMembers = householdsToAssign.stream()
                .mapToInt(this::getHouseholdMemberCount)
                .sum();

        if (table.getChairCount() != null && (currentSeated + newMembers) > table.getChairCount()) {
            throw new BadRequestException("Not enough chairs. Table has " + table.getChairCount()
                    + " chairs, " + currentSeated + " already seated, trying to add " + newMembers);
        }

        for (Household h : householdsToAssign) {
            if (!h.getWorkspace().getId().equals(workspaceId)) {
                throw new BadRequestException("Household " + h.getId() + " does not belong to this workspace");
            }
            h.setAssignedTable(table);
            householdRepository.save(h);
        }

        // Refresh the table to get updated household list
        table = tableRepository.findById(tableId).orElseThrow();
        log.info("Households assigned to table: tableId={}, workspaceId={}, householdIds={}", tableId, workspaceId, householdIds);
        return toResponse(table);
    }

    @Transactional
    public void unassignHousehold(Long workspaceId, Long tableId, Long householdId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        findTableInWorkspace(workspaceId, tableId);

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        if (household.getAssignedTable() == null || !household.getAssignedTable().getId().equals(tableId)) {
            throw new BadRequestException("Household is not assigned to this table");
        }

        household.setAssignedTable(null);
        householdRepository.save(household);
        log.info("Household unassigned from table: tableId={}, householdId={}, workspaceId={}", tableId, householdId, workspaceId);
    }

    public List<HouseholdResponse> getUnassignedHouseholds(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        return householdRepository.findByWorkspaceIdAndAssignedTableIsNull(workspaceId).stream()
                .map(EntityMapper::toHouseholdResponse)
                .toList();
    }

    public SeatingStatsResponse getStats(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Fetching seating stats: workspaceId={}", workspaceId);

        List<SeatingTable> tables = tableRepository.findByWorkspaceId(workspaceId);
        List<Household> allHouseholds = householdRepository.findByWorkspaceId(workspaceId);

        int totalChairs = tables.stream()
                .mapToInt(t -> t.getChairCount() != null ? t.getChairCount() : 0)
                .sum();
        int filledChairs = tables.stream()
                .mapToInt(this::calculateSeatedCount)
                .sum();
        long assignedHouseholds = allHouseholds.stream()
                .filter(h -> h.getAssignedTable() != null)
                .count();

        return SeatingStatsResponse.builder()
                .totalTables(tables.size())
                .totalChairs(totalChairs)
                .filledChairs(filledChairs)
                .emptyChairs(totalChairs - filledChairs)
                .assignedHouseholds((int) assignedHouseholds)
                .unassignedHouseholds((int) (allHouseholds.size() - assignedHouseholds))
                .build();
    }

    private int calculateSeatedCount(SeatingTable table) {
        List<Household> households = table.getHouseholds() != null ? table.getHouseholds() : Collections.emptyList();
        return households.stream()
                .mapToInt(this::getHouseholdMemberCount)
                .sum();
    }

    private int getHouseholdMemberCount(Household household) {
        List<Guest> members = household.getMembers() != null ? household.getMembers() : Collections.emptyList();
        return members.stream()
                .mapToInt(g -> (g.getAdults() != null ? g.getAdults() : 1) + (g.getChildren() != null ? g.getChildren() : 0))
                .sum();
    }

    private SeatingTable findTableInWorkspace(Long workspaceId, Long tableId) {
        SeatingTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Seating table not found"));
        if (!table.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Seating table not found in this workspace");
        }
        return table;
    }

    private SeatingTableResponse toResponse(SeatingTable table) {
        List<Household> households = table.getHouseholds() != null ? table.getHouseholds() : Collections.emptyList();

        List<HouseholdResponse> householdResponses = households.stream()
                .map(EntityMapper::toHouseholdResponse)
                .toList();

        return SeatingTableResponse.builder()
                .id(table.getId())
                .name(table.getName())
                .tableShape(table.getTableShape())
                .chairCount(table.getChairCount())
                .positionX(table.getPositionX())
                .positionY(table.getPositionY())
                .rotation(table.getRotation())
                .isVip(table.isVip())
                .seatedCount(calculateSeatedCount(table))
                .householdCount(households.size())
                .households(householdResponses)
                .build();
    }
}
