package pl.piomin.services.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.piomin.services.model.entity.Invitation;
import pl.piomin.services.model.enums.ExportFormat;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvitationPdfService {

    private static final Logger log = LoggerFactory.getLogger(InvitationPdfService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("h:mm a");

    public byte[] generate(Invitation invitation, ExportFormat format) {
        log.info("Generating invitation {}: id={}, format={}, template={}", format, invitation.getId(), format, invitation.getTemplateId());
        byte[] pdfBytes = renderPdf(invitation);

        if (format == ExportFormat.JPEG) {
            byte[] jpegBytes = convertPdfToJpeg(pdfBytes);
            log.debug("Invitation JPEG rendered: id={}, size={} bytes", invitation.getId(), jpegBytes.length);
            return jpegBytes;
        }

        log.debug("Invitation PDF rendered: id={}, size={} bytes", invitation.getId(), pdfBytes.length);
        return pdfBytes;
    }

    private byte[] renderPdf(Invitation invitation) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            // A5 landscape for invitation card feel
            Rectangle pageSize = new Rectangle(PageSize.A5.getHeight(), PageSize.A5.getWidth());
            Document document = new Document(pageSize, 50, 50, 60, 60);
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();

            Color themeColor = parseColor(invitation.getSelectedColor(), new Color(0x8B, 0x6F, 0x4E));

            // VIP border
            if (invitation.isVipGuest()) {
                writer.setBoxSize("art", new Rectangle(
                        pageSize.getLeft() + 10, pageSize.getBottom() + 10,
                        pageSize.getRight() - 10, pageSize.getTop() - 10));
            }

            // Title fonts
            Font titleFont = new Font(Font.TIMES_ROMAN, 28, Font.BOLDITALIC, themeColor);
            Font subtitleFont = new Font(Font.TIMES_ROMAN, 14, Font.ITALIC, themeColor);
            Font bodyFont = new Font(Font.TIMES_ROMAN, 12, Font.NORMAL, Color.DARK_GRAY);
            Font greetingFont = new Font(Font.TIMES_ROMAN, 16, Font.ITALIC, Color.DARK_GRAY);
            Font detailFont = new Font(Font.TIMES_ROMAN, 11, Font.NORMAL, new Color(0x66, 0x66, 0x66));

            // Top decoration line
            Paragraph topLine = new Paragraph("~ ~ ~", subtitleFont);
            topLine.setAlignment(Element.ALIGN_CENTER);
            topLine.setSpacingAfter(15);
            document.add(topLine);

            // Greeting (personalized per household)
            if (invitation.getGreeting() != null && !invitation.getGreeting().isBlank()) {
                Paragraph greeting = new Paragraph(invitation.getGreeting(), greetingFont);
                greeting.setAlignment(Element.ALIGN_CENTER);
                greeting.setSpacingAfter(20);
                document.add(greeting);
            }

            // "You are cordially invited to the wedding of"
            Paragraph inviteText = new Paragraph("You are cordially invited to celebrate the marriage of", bodyFont);
            inviteText.setAlignment(Element.ALIGN_CENTER);
            inviteText.setSpacingAfter(15);
            document.add(inviteText);

            // Couple names
            String coupleNames = formatCoupleNames(invitation.getName1(), invitation.getName2());
            Paragraph names = new Paragraph(coupleNames, titleFont);
            names.setAlignment(Element.ALIGN_CENTER);
            names.setSpacingAfter(20);
            document.add(names);

            // Date
            if (invitation.getEventDate() != null) {
                String dateStr = invitation.getEventDate().format(DATE_FORMAT);
                Paragraph date = new Paragraph(dateStr, subtitleFont);
                date.setAlignment(Element.ALIGN_CENTER);
                date.setSpacingAfter(5);
                document.add(date);
            }

            // Time
            if (invitation.getEventTime() != null) {
                String timeStr = "at " + invitation.getEventTime().format(TIME_FORMAT);
                Paragraph time = new Paragraph(timeStr, bodyFont);
                time.setAlignment(Element.ALIGN_CENTER);
                time.setSpacingAfter(10);
                document.add(time);
            }

            // Venue
            if (invitation.getVenue() != null && !invitation.getVenue().isBlank()) {
                Paragraph venue = new Paragraph(invitation.getVenue(), bodyFont);
                venue.setAlignment(Element.ALIGN_CENTER);
                venue.setSpacingAfter(20);
                document.add(venue);
            }

            // Bottom decoration
            Paragraph bottomLine = new Paragraph("~ ~ ~", subtitleFont);
            bottomLine.setAlignment(Element.ALIGN_CENTER);
            document.add(bottomLine);

            // VIP note
            if (invitation.isVipGuest()) {
                Paragraph vipNote = new Paragraph("VIP Guest", detailFont);
                vipNote.setAlignment(Element.ALIGN_CENTER);
                vipNote.setSpacingBefore(10);
                document.add(vipNote);
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Failed to generate invitation PDF", e);
            throw new RuntimeException("Failed to generate invitation PDF: " + e.getMessage(), e);
        }
    }

    private byte[] convertPdfToJpeg(byte[] pdfBytes) {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFRenderer renderer = new PDFRenderer(document);
            BufferedImage image = renderer.renderImageWithDPI(0, 300);

            ByteArrayOutputStream jpegOut = new ByteArrayOutputStream();
            ImageIO.write(image, "JPEG", jpegOut);
            return jpegOut.toByteArray();
        } catch (Exception e) {
            log.error("Failed to convert PDF to JPEG", e);
            throw new RuntimeException("Failed to convert to JPEG: " + e.getMessage(), e);
        }
    }

    private String formatCoupleNames(String name1, String name2) {
        if (name1 != null && name2 != null) {
            return name1 + "\n&\n" + name2;
        }
        if (name1 != null) return name1;
        if (name2 != null) return name2;
        return "The Happy Couple";
    }

    private Color parseColor(String hex, Color defaultColor) {
        if (hex == null || hex.isBlank()) return defaultColor;
        try {
            hex = hex.startsWith("#") ? hex.substring(1) : hex;
            return new Color(Integer.parseInt(hex, 16));
        } catch (Exception e) {
            return defaultColor;
        }
    }
}
