package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.BadRequestException;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.request.InvitationRequest;
import pl.piomin.services.model.dto.response.InvitationResponse;
import pl.piomin.services.model.dto.response.TemplateResponse;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.Invitation;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.ExportFormat;
import pl.piomin.services.model.enums.InvitationStatus;
import pl.piomin.services.model.enums.InvitationTemplate;
import pl.piomin.services.repository.HouseholdRepository;
import pl.piomin.services.repository.InvitationRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.Arrays;
import java.util.List;

@Service
public class InvitationService {

    private static final Logger log = LoggerFactory.getLogger(InvitationService.class);

    private final InvitationRepository invitationRepository;
    private final HouseholdRepository householdRepository;
    private final WorkspaceAuthorizationService authorizationService;
    private final InvitationPdfService pdfService;

    public InvitationService(InvitationRepository invitationRepository,
                             HouseholdRepository householdRepository,
                             WorkspaceAuthorizationService authorizationService,
                             InvitationPdfService pdfService) {
        this.invitationRepository = invitationRepository;
        this.householdRepository = householdRepository;
        this.authorizationService = authorizationService;
        this.pdfService = pdfService;
    }

    @Transactional
    public InvitationResponse create(Long workspaceId, InvitationRequest request, Long userId) {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        Household household = null;
        if (request.getHouseholdId() != null) {
            household = householdRepository.findById(request.getHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        }

        String greeting = request.getGreeting();
        String addressLine = request.getAddressLine();
        if (household != null) {
            if (greeting == null || greeting.isBlank()) {
                greeting = "Dear " + household.getFormalAddress();
            }
            if (addressLine == null || addressLine.isBlank()) {
                addressLine = household.getFormalAddress();
            }
        }

        Invitation invitation = Invitation.builder()
                .templateId(request.getTemplateId())
                .name1(request.getName1())
                .name2(request.getName2())
                .eventDate(request.getEventDate())
                .eventTime(request.getEventTime())
                .venue(request.getVenue())
                .selectedColor(request.getSelectedColor())
                .greeting(greeting)
                .addressLine(addressLine)
                .isVipGuest(request.isVipGuest())
                .status(InvitationStatus.DRAFT)
                .household(household)
                .workspace(workspace)
                .build();

        invitation = invitationRepository.save(invitation);
        log.info("Invitation created: id={}, workspaceId={}, householdId={}", invitation.getId(), workspaceId, household != null ? household.getId() : null);
        return toResponse(invitation);
    }

    public List<InvitationResponse> list(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Listing invitations: workspaceId={}", workspaceId);
        return invitationRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public InvitationResponse getById(Long workspaceId, Long invitationId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        return toResponse(findInWorkspace(workspaceId, invitationId));
    }

    @Transactional
    public InvitationResponse update(Long workspaceId, Long invitationId, InvitationRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Invitation invitation = findInWorkspace(workspaceId, invitationId);

        invitation.setTemplateId(request.getTemplateId());
        invitation.setName1(request.getName1());
        invitation.setName2(request.getName2());
        invitation.setEventDate(request.getEventDate());
        invitation.setEventTime(request.getEventTime());
        invitation.setVenue(request.getVenue());
        invitation.setSelectedColor(request.getSelectedColor());
        if (request.getGreeting() != null) invitation.setGreeting(request.getGreeting());
        if (request.getAddressLine() != null) invitation.setAddressLine(request.getAddressLine());
        invitation.setVipGuest(request.isVipGuest());

        if (request.getHouseholdId() != null) {
            Household household = householdRepository.findById(request.getHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
            invitation.setHousehold(household);
        }

        invitation = invitationRepository.save(invitation);
        log.info("Invitation updated: id={}, workspaceId={}", invitation.getId(), workspaceId);
        return toResponse(invitation);
    }

    @Transactional
    public void delete(Long workspaceId, Long invitationId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Invitation invitation = findInWorkspace(workspaceId, invitationId);
        invitationRepository.delete(invitation);
        log.info("Invitation deleted: id={}, workspaceId={}", invitationId, workspaceId);
    }

    @Transactional
    public InvitationResponse generate(Long workspaceId, Long invitationId, ExportFormat format, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Invitation invitation = findInWorkspace(workspaceId, invitationId);

        byte[] content = pdfService.generate(invitation, format);

        // In a full implementation, upload to S3 and save the key
        // For now, store a placeholder key
        String s3Key = "workspaces/" + workspaceId + "/invitations/" + invitationId + "." + format.name().toLowerCase();
        if (format == ExportFormat.PDF) {
            invitation.setPdfS3Key(s3Key);
        } else {
            invitation.setJpegS3Key(s3Key);
        }
        invitation.setStatus(InvitationStatus.GENERATED);

        invitation = invitationRepository.save(invitation);
        log.info("Invitation generated: id={}, workspaceId={}, format={}", invitation.getId(), workspaceId, format);
        return toResponse(invitation);
    }

    @Async
    @Transactional
    public void generateBatch(Long workspaceId, String templateId, ExportFormat format, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.info("Invitation batch generation started: workspaceId={}, format={}", workspaceId, format);

        List<Household> households = householdRepository.findByWorkspaceId(workspaceId);
        for (Household household : households) {
            List<Invitation> existing = invitationRepository.findByWorkspaceIdAndHouseholdId(
                    workspaceId, household.getId());

            Invitation invitation;
            if (!existing.isEmpty()) {
                invitation = existing.get(0);
                if (templateId != null) invitation.setTemplateId(templateId);
            } else {
                invitation = Invitation.builder()
                        .templateId(templateId)
                        .greeting("Dear " + household.getFormalAddress())
                        .addressLine(household.getFormalAddress())
                        .household(household)
                        .workspace(household.getWorkspace())
                        .build();
                invitation = invitationRepository.save(invitation);
            }

            byte[] content = pdfService.generate(invitation, format);
            String s3Key = "workspaces/" + workspaceId + "/invitations/" + invitation.getId()
                    + "." + format.name().toLowerCase();
            if (format == ExportFormat.PDF) {
                invitation.setPdfS3Key(s3Key);
            } else {
                invitation.setJpegS3Key(s3Key);
            }
            invitation.setStatus(InvitationStatus.GENERATED);
            invitationRepository.save(invitation);
        }
        log.info("Invitation batch generation completed: workspaceId={}, count={}", workspaceId, households.size());
    }

    public byte[] preview(InvitationRequest request, ExportFormat format) {
        Invitation previewInvitation = Invitation.builder()
                .templateId(request.getTemplateId())
                .name1(request.getName1())
                .name2(request.getName2())
                .eventDate(request.getEventDate())
                .eventTime(request.getEventTime())
                .venue(request.getVenue())
                .selectedColor(request.getSelectedColor())
                .greeting(request.getGreeting())
                .addressLine(request.getAddressLine())
                .isVipGuest(request.isVipGuest())
                .build();

        return pdfService.generate(previewInvitation, format);
    }

    public byte[] download(Long workspaceId, Long invitationId, ExportFormat format, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Invitation invitation = findInWorkspace(workspaceId, invitationId);

        if (format == ExportFormat.PDF && invitation.getPdfS3Key() == null) {
            throw new BadRequestException("PDF not generated yet. Generate it first.");
        }
        if (format == ExportFormat.JPEG && invitation.getJpegS3Key() == null) {
            throw new BadRequestException("JPEG not generated yet. Generate it first.");
        }

        // In full implementation, download from S3
        // For now, regenerate on-the-fly
        return pdfService.generate(invitation, format);
    }

    public List<TemplateResponse> listTemplates() {
        return Arrays.stream(InvitationTemplate.values())
                .map(t -> TemplateResponse.builder()
                        .id(t.name())
                        .displayName(t.getDisplayName())
                        .description(t.getDescription())
                        .build())
                .toList();
    }

    private Invitation findInWorkspace(Long workspaceId, Long invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));
        if (!invitation.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Invitation not found in this workspace");
        }
        return invitation;
    }

    private InvitationResponse toResponse(Invitation inv) {
        InvitationResponse.InvitationResponseBuilder builder = InvitationResponse.builder()
                .id(inv.getId())
                .templateId(inv.getTemplateId())
                .name1(inv.getName1())
                .name2(inv.getName2())
                .eventDate(inv.getEventDate())
                .eventTime(inv.getEventTime())
                .venue(inv.getVenue())
                .selectedColor(inv.getSelectedColor())
                .greeting(inv.getGreeting())
                .addressLine(inv.getAddressLine())
                .isVipGuest(inv.isVipGuest())
                .status(inv.getStatus())
                .hasPdf(inv.getPdfS3Key() != null)
                .hasJpeg(inv.getJpegS3Key() != null);

        if (inv.getHousehold() != null) {
            builder.householdId(inv.getHousehold().getId());
            builder.householdName(inv.getHousehold().getHouseholdName());
        }

        return builder.build();
    }
}
