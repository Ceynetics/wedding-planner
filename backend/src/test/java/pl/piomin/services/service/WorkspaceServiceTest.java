package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.exception.BadRequestException;
import pl.piomin.services.exception.ResourceNotFoundException;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkspaceServiceTest {

    @Mock private WorkspaceRepository workspaceRepository;
    @Mock private WorkspaceMemberRepository memberRepository;
    @Mock private UserRepository userRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private WorkspaceService workspaceService;

    private User testUser;
    private Workspace testWorkspace;

    @BeforeEach
    void setUp() {
        testUser = User.builder().fullName("Test User").email("test@example.com").build();
        testUser.setId(1L);

        testWorkspace = Workspace.builder()
                .eventName("Our Wedding")
                .eventDate(LocalDate.of(2026, 6, 15))
                .venue("Grand Hotel")
                .budget(BigDecimal.valueOf(50000))
                .pairingCode("ABC123")
                .build();
        testWorkspace.setId(1L);
    }

    @Test
    void create_shouldCreateWorkspaceAndAddOwner() {
        WorkspaceRequest request = WorkspaceRequest.builder()
                .eventName("Our Wedding")
                .eventDate(LocalDate.of(2026, 6, 15))
                .venue("Grand Hotel")
                .budget(BigDecimal.valueOf(50000))
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(workspaceRepository.save(any(Workspace.class))).thenReturn(testWorkspace);
        when(memberRepository.save(any(WorkspaceMember.class))).thenReturn(new WorkspaceMember());
        when(workspaceRepository.findByPairingCode(anyString())).thenReturn(Optional.empty());
        when(memberRepository.findByWorkspaceId(anyLong())).thenReturn(List.of(
                WorkspaceMember.builder().user(testUser).role(WorkspaceRole.OWNER).build()
        ));

        WorkspaceResponse response = workspaceService.create(request, 1L);

        assertNotNull(response);
        assertEquals("Our Wedding", response.getEventName());
    }

    @Test
    void listForUser_shouldReturnUserWorkspaces() {
        WorkspaceMember membership = WorkspaceMember.builder()
                .user(testUser).workspace(testWorkspace).role(WorkspaceRole.OWNER).build();

        when(memberRepository.findByUserId(1L)).thenReturn(List.of(membership));
        when(memberRepository.findByWorkspaceId(anyLong())).thenReturn(List.of(membership));

        List<WorkspaceResponse> result = workspaceService.listForUser(1L);

        assertEquals(1, result.size());
        assertEquals("Our Wedding", result.get(0).getEventName());
    }

    @Test
    void joinByPairingCode_shouldAddMember() {
        when(workspaceRepository.findByPairingCode("ABC123")).thenReturn(Optional.of(testWorkspace));
        when(userRepository.findById(2L)).thenReturn(Optional.of(testUser));
        when(memberRepository.existsByUserIdAndWorkspaceId(2L, 1L)).thenReturn(false);
        when(memberRepository.save(any(WorkspaceMember.class))).thenReturn(new WorkspaceMember());
        when(memberRepository.findByWorkspaceId(anyLong())).thenReturn(List.of());

        WorkspaceResponse response = workspaceService.joinByPairingCode("ABC123", 2L);

        assertNotNull(response);
    }

    @Test
    void joinByPairingCode_shouldThrowForInvalidCode() {
        when(workspaceRepository.findByPairingCode("INVALID")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> workspaceService.joinByPairingCode("INVALID", 1L));
    }

    @Test
    void joinByPairingCode_shouldThrowIfAlreadyMember() {
        when(workspaceRepository.findByPairingCode("ABC123")).thenReturn(Optional.of(testWorkspace));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(memberRepository.existsByUserIdAndWorkspaceId(1L, 1L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> workspaceService.joinByPairingCode("ABC123", 1L));
    }
}
