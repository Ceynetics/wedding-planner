package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.BadRequestException;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.request.InviteRequest;
import pl.piomin.services.model.dto.request.WorkspaceRequest;
import pl.piomin.services.model.dto.response.WorkspaceResponse;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.entity.WorkspaceMember;
import pl.piomin.services.model.enums.WorkspaceRole;
import pl.piomin.services.repository.UserRepository;
import pl.piomin.services.repository.WorkspaceMemberRepository;
import pl.piomin.services.repository.WorkspaceRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.security.SecureRandom;
import java.util.List;

@Service
public class WorkspaceService {

    private static final Logger log = LoggerFactory.getLogger(WorkspaceService.class);

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final WorkspaceAuthorizationService authorizationService;
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public WorkspaceService(WorkspaceRepository workspaceRepository,
                            WorkspaceMemberRepository memberRepository,
                            UserRepository userRepository,
                            WorkspaceAuthorizationService authorizationService) {
        this.workspaceRepository = workspaceRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public WorkspaceResponse create(WorkspaceRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Workspace workspace = Workspace.builder()
                .eventName(request.getEventName())
                .eventDate(request.getEventDate())
                .venue(request.getVenue())
                .budget(request.getBudget())
                .pairingCode(generatePairingCode())
                .build();
        workspace = workspaceRepository.save(workspace);

        WorkspaceMember member = WorkspaceMember.builder()
                .user(user)
                .workspace(workspace)
                .role(WorkspaceRole.OWNER)
                .build();
        memberRepository.save(member);

        log.info("Workspace created: id={}, eventName={}, userId={}", workspace.getId(), workspace.getEventName(), userId);
        return toResponse(workspace);
    }

    public List<WorkspaceResponse> listForUser(Long userId) {
        log.debug("Listing workspaces for userId={}", userId);
        List<WorkspaceMember> memberships = memberRepository.findByUserId(userId);
        return memberships.stream()
                .map(m -> toResponse(m.getWorkspace()))
                .toList();
    }

    public WorkspaceResponse getById(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
        return toResponse(workspace);
    }

    @Transactional
    public WorkspaceResponse update(Long workspaceId, WorkspaceRequest request, Long userId) {
        authorizationService.validateOwnerOrPartner(workspaceId, userId);
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        workspace.setEventName(request.getEventName());
        workspace.setEventDate(request.getEventDate());
        workspace.setVenue(request.getVenue());
        workspace.setBudget(request.getBudget());

        workspace = workspaceRepository.save(workspace);
        log.info("Workspace updated: id={}, eventName={}", workspace.getId(), workspace.getEventName());
        return toResponse(workspace);
    }

    @Transactional
    public void invite(Long workspaceId, InviteRequest request, Long userId) {
        authorizationService.validateOwnerOrPartner(workspaceId, userId);
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        User invitee = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + request.getEmail() + " not found"));

        if (memberRepository.existsByUserIdAndWorkspaceId(invitee.getId(), workspaceId)) {
            throw new BadRequestException("User is already a member of this workspace");
        }

        WorkspaceRole role = request.getRole() != null ? request.getRole() : WorkspaceRole.PARTNER;
        WorkspaceMember member = WorkspaceMember.builder()
                .user(invitee)
                .workspace(workspace)
                .role(role)
                .build();
        memberRepository.save(member);
        log.info("User invited to workspace: workspaceId={}, inviteeEmail={}, role={}", workspaceId, request.getEmail(), role);
    }

    @Transactional
    public WorkspaceResponse joinByPairingCode(String pairingCode, Long userId) {
        Workspace workspace = workspaceRepository.findByPairingCode(pairingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid pairing code"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (memberRepository.existsByUserIdAndWorkspaceId(userId, workspace.getId())) {
            throw new BadRequestException("You are already a member of this workspace");
        }

        WorkspaceMember member = WorkspaceMember.builder()
                .user(user)
                .workspace(workspace)
                .role(WorkspaceRole.PARTNER)
                .build();
        memberRepository.save(member);

        log.info("User joined workspace via pairing code: workspaceId={}, userId={}", workspace.getId(), userId);
        return toResponse(workspace);
    }

    private WorkspaceResponse toResponse(Workspace workspace) {
        List<WorkspaceResponse.MemberResponse> members = memberRepository
                .findByWorkspaceId(workspace.getId())
                .stream()
                .map(m -> WorkspaceResponse.MemberResponse.builder()
                        .userId(m.getUser().getId())
                        .fullName(m.getUser().getFullName())
                        .email(m.getUser().getEmail())
                        .avatarUrl(m.getUser().getAvatarUrl())
                        .role(m.getRole().name())
                        .build())
                .toList();

        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .eventName(workspace.getEventName())
                .eventDate(workspace.getEventDate())
                .venue(workspace.getVenue())
                .budget(workspace.getBudget())
                .pairingCode(workspace.getPairingCode())
                .members(members)
                .build();
    }

    private String generatePairingCode() {
        StringBuilder code = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            code.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
        }
        // Ensure uniqueness
        if (workspaceRepository.findByPairingCode(code.toString()).isPresent()) {
            return generatePairingCode();
        }
        return code.toString();
    }
}
