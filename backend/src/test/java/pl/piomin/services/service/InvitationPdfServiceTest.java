package pl.piomin.services.service;

import org.junit.jupiter.api.Test;
import pl.piomin.services.model.entity.Invitation;
import pl.piomin.services.model.enums.ExportFormat;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class InvitationPdfServiceTest {

    private final InvitationPdfService pdfService = new InvitationPdfService();

    @Test
    void generate_shouldProduceValidPdfBytes() {
        Invitation invitation = Invitation.builder()
                .name1("Emma Johnson")
                .name2("James Smith")
                .eventDate(LocalDate.of(2026, 6, 15))
                .eventTime(LocalTime.of(14, 0))
                .venue("Grand Ballroom Hotel, 1 Grand Avenue")
                .selectedColor("#8B6F4E")
                .greeting("Dear Mr. and Mrs. Williams")
                .addressLine("Mr. and Mrs. Williams")
                .isVipGuest(false)
                .build();

        byte[] pdf = pdfService.generate(invitation, ExportFormat.PDF);

        assertNotNull(pdf);
        assertTrue(pdf.length > 0);
        // PDF magic bytes: %PDF
        assertTrue(pdf[0] == '%' && pdf[1] == 'P' && pdf[2] == 'D' && pdf[3] == 'F');
    }

    @Test
    void generate_shouldProduceValidJpegBytes() {
        Invitation invitation = Invitation.builder()
                .name1("Emma Johnson")
                .name2("James Smith")
                .eventDate(LocalDate.of(2026, 6, 15))
                .venue("Grand Ballroom Hotel")
                .greeting("Dear Johnson Family")
                .build();

        byte[] jpeg = pdfService.generate(invitation, ExportFormat.JPEG);

        assertNotNull(jpeg);
        assertTrue(jpeg.length > 0);
        // JPEG magic bytes: FF D8 FF
        assertTrue((jpeg[0] & 0xFF) == 0xFF && (jpeg[1] & 0xFF) == 0xD8);
    }

    @Test
    void generate_shouldHandleVipInvitation() {
        Invitation invitation = Invitation.builder()
                .name1("Emma Johnson")
                .name2("James Smith")
                .eventDate(LocalDate.of(2026, 6, 15))
                .greeting("Dear Dr. and Mrs. Thompson")
                .isVipGuest(true)
                .build();

        byte[] pdf = pdfService.generate(invitation, ExportFormat.PDF);

        assertNotNull(pdf);
        assertTrue(pdf.length > 0);
    }

    @Test
    void generate_shouldHandleMinimalInvitation() {
        Invitation invitation = Invitation.builder().build();

        byte[] pdf = pdfService.generate(invitation, ExportFormat.PDF);

        assertNotNull(pdf);
        assertTrue(pdf.length > 0);
    }

    @Test
    void generate_shouldHandleCustomColor() {
        Invitation invitation = Invitation.builder()
                .name1("Bride")
                .name2("Groom")
                .selectedColor("#FF6B6B")
                .build();

        byte[] pdf = pdfService.generate(invitation, ExportFormat.PDF);

        assertNotNull(pdf);
        assertTrue(pdf.length > 0);
    }
}
