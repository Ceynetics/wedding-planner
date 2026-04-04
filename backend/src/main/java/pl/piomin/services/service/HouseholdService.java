package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.mapper.EntityMapper;
import pl.piomin.services.model.dto.request.HouseholdRequest;
import pl.piomin.services.model.dto.response.HouseholdResponse;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.List;

@Service
public class HouseholdService {

    private static final Logger log = LoggerFactory.getLogger(HouseholdService.class);

    private final HouseholdRepository householdRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public HouseholdService(HouseholdRepository householdRepository,
                            WorkspaceAuthorizationService authorizationService) {
        this.householdRepository = householdRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public HouseholdResponse create(Long workspaceId, HouseholdRequest request, Long userId) {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        String formalAddress = request.getFormalAddress();
        if (formalAddress == null || formalAddress.isBlank()) {
            formalAddress = request.getHouseholdName();
        }

        Household household = Household.builder()
                .householdName(request.getHouseholdName())
                .formalAddress(formalAddress)
                .addressStyle(request.getAddressStyle())
                .workspace(workspace)
                .build();

        household = householdRepository.save(household);
        log.info("Household created: id={}, workspaceId={}", household.getId(), workspaceId);
        return EntityMapper.toHouseholdResponse(household);
    }

    public List<HouseholdResponse> listByWorkspace(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Listing households: workspaceId={}", workspaceId);
        return householdRepository.findByWorkspaceId(workspaceId).stream()
                .map(EntityMapper::toHouseholdResponse)
                .toList();
    }

    public HouseholdResponse getById(Long workspaceId, Long householdId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Household household = findHouseholdInWorkspace(workspaceId, householdId);
        return EntityMapper.toHouseholdResponse(household);
    }

    @Transactional
    public HouseholdResponse update(Long workspaceId, Long householdId, HouseholdRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Household household = findHouseholdInWorkspace(workspaceId, householdId);

        household.setHouseholdName(request.getHouseholdName());
        household.setAddressStyle(request.getAddressStyle());
        if (request.getFormalAddress() != null && !request.getFormalAddress().isBlank()) {
            household.setFormalAddress(request.getFormalAddress());
        }

        household = householdRepository.save(household);
        log.info("Household updated: id={}, workspaceId={}", household.getId(), workspaceId);
        return EntityMapper.toHouseholdResponse(household);
    }

    @Transactional
    public void delete(Long workspaceId, Long householdId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Household household = findHouseholdInWorkspace(workspaceId, householdId);
        householdRepository.delete(household);
        log.info("Household deleted: id={}, workspaceId={}", householdId, workspaceId);
    }

    public List<HouseholdResponse> getUnassigned(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        return householdRepository.findByWorkspaceIdAndAssignedTableIsNull(workspaceId).stream()
                .map(EntityMapper::toHouseholdResponse)
                .toList();
    }

    private Household findHouseholdInWorkspace(Long workspaceId, Long householdId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        if (!household.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Household not found in this workspace");
        }
        return household;
    }
}
