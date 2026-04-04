package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.mapper.EntityMapper;
import pl.piomin.services.model.dto.request.GuestRequest;
import pl.piomin.services.model.dto.response.GuestResponse;
import pl.piomin.services.model.dto.response.GuestStatsResponse;
import pl.piomin.services.model.entity.Guest;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.AddressStyle;
import pl.piomin.services.model.enums.GuestCategory;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;
import pl.piomin.services.repository.GuestRepository;
import pl.piomin.services.repository.GuestSpecifications;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.List;

@Service
public class GuestService {

    private static final Logger log = LoggerFactory.getLogger(GuestService.class);

    private final GuestRepository guestRepository;
    private final HouseholdRepository householdRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public GuestService(GuestRepository guestRepository,
                        HouseholdRepository householdRepository,
                        WorkspaceAuthorizationService authorizationService) {
        this.guestRepository = guestRepository;
        this.householdRepository = householdRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public GuestResponse create(Long workspaceId, GuestRequest request, Long userId) {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        Household household = resolveHousehold(request, workspace);

        Guest guest = Guest.builder()
                .name(request.getName())
                .title(request.getTitle())
                .side(request.getSide())
                .status(request.getStatus() != null ? request.getStatus() : GuestStatus.PENDING)
                .category(request.getCategory())
                .phone(request.getPhone())
                .email(request.getEmail())
                .adults(request.getAdults() != null ? request.getAdults() : 1)
                .children(request.getChildren() != null ? request.getChildren() : 0)
                .dietary(request.getDietary())
                .isVip(request.isVip())
                .isHeadOfHousehold(request.isHeadOfHousehold())
                .notes(request.getNotes())
                .household(household)
                .workspace(workspace)
                .build();

        guest = guestRepository.save(guest);

        // If this is the head of household and household was just created, update the reference
        if (household != null && household.getHeadGuestId() == null && request.isHeadOfHousehold()) {
            household.setHeadGuestId(guest.getId());
            householdRepository.save(household);
        }

        log.info("Guest created: id={}, workspaceId={}, household={}", guest.getId(), workspaceId, household != null ? household.getId() : null);
        return EntityMapper.toGuestResponse(guest);
    }

    public List<GuestResponse> list(Long workspaceId, Long userId,
                                     GuestStatus status, GuestSide side,
                                     GuestCategory category, Long householdId,
                                     String search) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Fetching guests: workspaceId={}, filters={status={}, side={}, category={}, householdId={}, search={}}", workspaceId, status, side, category, householdId, search);

        Specification<Guest> spec = GuestSpecifications.inWorkspace(workspaceId);

        if (status != null) spec = spec.and(GuestSpecifications.hasStatus(status));
        if (side != null) spec = spec.and(GuestSpecifications.hasSide(side));
        if (category != null) spec = spec.and(GuestSpecifications.hasCategory(category));
        if (householdId != null) spec = spec.and(GuestSpecifications.inHousehold(householdId));
        if (search != null && !search.isBlank()) spec = spec.and(GuestSpecifications.nameContains(search));

        return guestRepository.findAll(spec).stream()
                .map(EntityMapper::toGuestResponse)
                .toList();
    }

    public GuestResponse getById(Long workspaceId, Long guestId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Guest guest = findGuestInWorkspace(workspaceId, guestId);
        return EntityMapper.toGuestResponse(guest);
    }

    @Transactional
    public GuestResponse update(Long workspaceId, Long guestId, GuestRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Guest guest = findGuestInWorkspace(workspaceId, guestId);

        guest.setName(request.getName());
        guest.setTitle(request.getTitle());
        guest.setSide(request.getSide());
        if (request.getStatus() != null) guest.setStatus(request.getStatus());
        guest.setCategory(request.getCategory());
        guest.setPhone(request.getPhone());
        guest.setEmail(request.getEmail());
        if (request.getAdults() != null) guest.setAdults(request.getAdults());
        if (request.getChildren() != null) guest.setChildren(request.getChildren());
        guest.setDietary(request.getDietary());
        guest.setVip(request.isVip());
        guest.setHeadOfHousehold(request.isHeadOfHousehold());
        guest.setNotes(request.getNotes());

        // Handle household change
        if (request.getHouseholdId() != null && (guest.getHousehold() == null ||
                !guest.getHousehold().getId().equals(request.getHouseholdId()))) {
            Household newHousehold = householdRepository.findById(request.getHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
            guest.setHousehold(newHousehold);
        }

        guest = guestRepository.save(guest);
        log.info("Guest updated: id={}, workspaceId={}", guest.getId(), workspaceId);
        return EntityMapper.toGuestResponse(guest);
    }

    @Transactional
    public void delete(Long workspaceId, Long guestId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Guest guest = findGuestInWorkspace(workspaceId, guestId);
        guestRepository.delete(guest);
        log.info("Guest deleted: id={}, workspaceId={}", guestId, workspaceId);
    }

    public GuestStatsResponse getStats(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Fetching guest stats: workspaceId={}", workspaceId);

        List<Guest> guests = guestRepository.findByWorkspaceId(workspaceId);
        long totalAdults = guests.stream().mapToLong(g -> g.getAdults() != null ? g.getAdults() : 1).sum();
        long totalChildren = guests.stream().mapToLong(g -> g.getChildren() != null ? g.getChildren() : 0).sum();
        long totalHouseholds = guests.stream()
                .map(g -> g.getHousehold() != null ? g.getHousehold().getId() : -g.getId())
                .distinct()
                .count();

        return GuestStatsResponse.builder()
                .total(guests.size())
                .confirmed(guests.stream().filter(g -> g.getStatus() == GuestStatus.CONFIRMED).count())
                .pending(guests.stream().filter(g -> g.getStatus() == GuestStatus.PENDING).count())
                .notInvited(guests.stream().filter(g -> g.getStatus() == GuestStatus.NOT_INVITED).count())
                .vipCount(guests.stream().filter(Guest::isVip).count())
                .totalAdults(totalAdults)
                .totalChildren(totalChildren)
                .totalHouseholds(totalHouseholds)
                .build();
    }

    private Household resolveHousehold(GuestRequest request, Workspace workspace) {
        if (request.getHouseholdId() != null) {
            return householdRepository.findById(request.getHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        }

        // Auto-create a household for the guest
        AddressStyle style = request.getNewHouseholdStyle() != null
                ? request.getNewHouseholdStyle()
                : AddressStyle.INDIVIDUAL;

        String householdName = request.getHouseholdName() != null && !request.getHouseholdName().isBlank()
                ? request.getHouseholdName()
                : request.getName();

        String formalAddress = request.getFormalAddress() != null && !request.getFormalAddress().isBlank()
                ? request.getFormalAddress()
                : generateFormalAddress(request.getTitle(), request.getName(), style);

        Household household = Household.builder()
                .householdName(householdName)
                .formalAddress(formalAddress)
                .addressStyle(style)
                .workspace(workspace)
                .build();

        return householdRepository.save(household);
    }

    private String generateFormalAddress(String title, String name, AddressStyle style) {
        String prefix = title != null && !title.isBlank() ? title + " " : "";
        return switch (style) {
            case INDIVIDUAL -> prefix + name;
            case COUPLE -> prefix.isBlank() ? "Mr. and Mrs. " + name : prefix + "and " + prefix + name;
            case FAMILY -> "The " + extractLastName(name) + " Family";
        };
    }

    private String extractLastName(String fullName) {
        String[] parts = fullName.trim().split("\\s+");
        return parts.length > 1 ? parts[parts.length - 1] : fullName;
    }

    private Guest findGuestInWorkspace(Long workspaceId, Long guestId) {
        Guest guest = guestRepository.findById(guestId)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found"));
        if (!guest.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Guest not found in this workspace");
        }
        return guest;
    }
}
