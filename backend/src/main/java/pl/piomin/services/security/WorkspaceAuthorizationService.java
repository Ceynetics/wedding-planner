package pl.piomin.services.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.entity.WorkspaceMember;
import pl.piomin.services.model.enums.WorkspaceRole;
import pl.piomin.services.repository.WorkspaceMemberRepository;
import pl.piomin.services.repository.WorkspaceRepository;

@Service
public class WorkspaceAuthorizationService {

    private static final Logger log = LoggerFactory.getLogger(WorkspaceAuthorizationService.class);

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;

    public WorkspaceAuthorizationService(WorkspaceRepository workspaceRepository,
                                          WorkspaceMemberRepository memberRepository) {
        this.workspaceRepository = workspaceRepository;
        this.memberRepository = memberRepository;
    }

    public Workspace validateMembership(Long workspaceId, Long userId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (!memberRepository.existsByUserIdAndWorkspaceId(userId, workspaceId)) {
            log.warn("Access denied: userId={} is not a member of workspaceId={}", userId, workspaceId);
            throw new AccessDeniedException("You are not a member of this workspace");
        }

        log.debug("Membership validated: userId={}, workspaceId={}", userId, workspaceId);
        return workspace;
    }

    public Workspace validateOwnerOrPartner(Long workspaceId, Long userId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        WorkspaceMember member = memberRepository.findByUserIdAndWorkspaceId(userId, workspaceId)
                .orElseThrow(() -> {
                    log.warn("Access denied: userId={} is not a member of workspaceId={}", userId, workspaceId);
                    return new AccessDeniedException("You are not a member of this workspace");
                });

        if (member.getRole() != WorkspaceRole.OWNER && member.getRole() != WorkspaceRole.PARTNER) {
            log.warn("Access denied: userId={} has role={} in workspaceId={}, requires OWNER or PARTNER", userId, member.getRole(), workspaceId);
            throw new AccessDeniedException("Only owners and partners can perform this action");
        }

        log.debug("Owner/Partner validated: userId={}, workspaceId={}, role={}", userId, workspaceId, member.getRole());
        return workspace;
    }
}
