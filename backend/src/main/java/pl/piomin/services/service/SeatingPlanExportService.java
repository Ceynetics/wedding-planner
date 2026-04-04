package pl.piomin.services.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.entity.Guest;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.SeatingTable;
import pl.piomin.services.model.enums.ExportFormat;
import pl.piomin.services.repository.SeatingTableRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Collections;
import java.util.List;

@Service
public class SeatingPlanExportService {

    private static final Logger log = LoggerFactory.getLogger(SeatingPlanExportService.class);

    private final SeatingTableRepository tableRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public SeatingPlanExportService(SeatingTableRepository tableRepository,
                                    WorkspaceAuthorizationService authorizationService) {
        this.tableRepository = tableRepository;
        this.authorizationService = authorizationService;
    }

    public byte[] exportFullPlan(Long workspaceId, ExportFormat format, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        List<SeatingTable> tables = tableRepository.findByWorkspaceId(workspaceId);

        log.info("Exporting full seating plan: workspaceId={}, format={}, tableCount={}", workspaceId, format, tables.size());
        byte[] pdfBytes = renderFullPlanPdf(tables);
        log.debug("Seating plan rendered: workspaceId={}, size={} bytes", workspaceId, pdfBytes.length);
        return format == ExportFormat.JPEG ? convertToJpeg(pdfBytes) : pdfBytes;
    }

    public byte[] exportSingleTable(Long workspaceId, Long tableId, ExportFormat format, Long userId) {
        log.info("Exporting single table: workspaceId={}, tableId={}, format={}", workspaceId, tableId, format);
        authorizationService.validateMembership(workspaceId, userId);
        SeatingTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Seating table not found"));
        if (!table.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Seating table not found in this workspace");
        }

        byte[] pdfBytes = renderSingleTablePdf(table);
        return format == ExportFormat.JPEG ? convertToJpeg(pdfBytes) : pdfBytes;
    }

    private byte[] renderFullPlanPdf(List<SeatingTable> tables) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, new Color(0x33, 0x33, 0x33));
            Font tableNameFont = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(0x44, 0x44, 0x44));
            Font bodyFont = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.DARK_GRAY);
            Font vipFont = new Font(Font.HELVETICA, 9, Font.BOLD, new Color(0xC0, 0x8A, 0x2C));

            // Title
            Paragraph title = new Paragraph("Seating Plan", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Summary stats
            int totalChairs = tables.stream().mapToInt(t -> t.getChairCount() != null ? t.getChairCount() : 0).sum();
            int seated = tables.stream().mapToInt(this::getSeatedCount).sum();
            Paragraph stats = new Paragraph(
                    tables.size() + " tables | " + totalChairs + " chairs | " + seated + " seated | "
                            + (totalChairs - seated) + " available", bodyFont);
            stats.setAlignment(Element.ALIGN_CENTER);
            stats.setSpacingAfter(20);
            document.add(stats);

            // Table grid (3 columns)
            PdfPTable grid = new PdfPTable(3);
            grid.setWidthPercentage(100);
            grid.setSpacingBefore(10);

            for (SeatingTable table : tables) {
                PdfPCell cell = createTableCell(table, tableNameFont, bodyFont, vipFont);
                grid.addCell(cell);
            }

            // Pad remaining cells
            int remainder = tables.size() % 3;
            if (remainder > 0) {
                for (int i = 0; i < 3 - remainder; i++) {
                    PdfPCell empty = new PdfPCell();
                    empty.setBorder(0);
                    grid.addCell(empty);
                }
            }

            document.add(grid);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate seating plan PDF", e);
            throw new RuntimeException("Failed to generate seating plan: " + e.getMessage(), e);
        }
    }

    private PdfPCell createTableCell(SeatingTable table, Font nameFont, Font bodyFont, Font vipFont) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);
        cell.setBorderColor(new Color(0xDD, 0xDD, 0xDD));

        // Table name + shape
        String shape = table.getTableShape() != null ? " (" + table.getTableShape().name() + ")" : "";
        Paragraph name = new Paragraph(table.getName() + shape, nameFont);
        cell.addElement(name);

        // VIP badge
        if (table.isVip()) {
            cell.addElement(new Paragraph("VIP", vipFont));
        }

        // Capacity
        int seated = getSeatedCount(table);
        int chairs = table.getChairCount() != null ? table.getChairCount() : 0;
        cell.addElement(new Paragraph(seated + "/" + chairs + " chairs", bodyFont));

        // Households and members
        List<Household> households = table.getHouseholds() != null ? table.getHouseholds() : Collections.emptyList();
        for (Household h : households) {
            cell.addElement(new Paragraph("  " + h.getHouseholdName(), bodyFont));
            List<Guest> members = h.getMembers() != null ? h.getMembers() : Collections.emptyList();
            for (Guest g : members) {
                String dietary = g.getDietary() != null ? " [" + g.getDietary() + "]" : "";
                String vip = g.isVip() ? " *VIP*" : "";
                cell.addElement(new Paragraph("    - " + g.getName() + dietary + vip, bodyFont));
            }
        }

        return cell;
    }

    private byte[] renderSingleTablePdf(SeatingTable table) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A5, 30, 30, 30, 30);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(0x33, 0x33, 0x33));
            Font subtitleFont = new Font(Font.HELVETICA, 11, Font.NORMAL, new Color(0x66, 0x66, 0x66));
            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
            Font bodyFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.DARK_GRAY);

            // Table name
            Paragraph title = new Paragraph(table.getName(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

            // Shape, capacity, VIP
            String shape = table.getTableShape() != null ? table.getTableShape().name() : "N/A";
            int chairs = table.getChairCount() != null ? table.getChairCount() : 0;
            int seated = getSeatedCount(table);
            String vip = table.isVip() ? " | VIP" : "";
            Paragraph info = new Paragraph(shape + " | " + seated + "/" + chairs + " chairs" + vip, subtitleFont);
            info.setAlignment(Element.ALIGN_CENTER);
            info.setSpacingAfter(15);
            document.add(info);

            // Guest table
            List<Household> households = table.getHouseholds() != null ? table.getHouseholds() : Collections.emptyList();
            if (!households.isEmpty()) {
                PdfPTable guestTable = new PdfPTable(new float[]{3, 2, 2, 2});
                guestTable.setWidthPercentage(100);

                Color headerBg = new Color(0x44, 0x44, 0x44);
                addHeaderCell(guestTable, "Guest Name", headerFont, headerBg);
                addHeaderCell(guestTable, "Household", headerFont, headerBg);
                addHeaderCell(guestTable, "Dietary", headerFont, headerBg);
                addHeaderCell(guestTable, "Status", headerFont, headerBg);

                for (Household h : households) {
                    List<Guest> members = h.getMembers() != null ? h.getMembers() : Collections.emptyList();
                    for (Guest g : members) {
                        guestTable.addCell(new Phrase(g.getName(), bodyFont));
                        guestTable.addCell(new Phrase(h.getHouseholdName(), bodyFont));
                        guestTable.addCell(new Phrase(g.getDietary() != null ? g.getDietary() : "-", bodyFont));
                        guestTable.addCell(new Phrase(g.getStatus() != null ? g.getStatus().name() : "-", bodyFont));
                    }
                }

                document.add(guestTable);
            } else {
                Paragraph empty = new Paragraph("No households assigned yet", subtitleFont);
                empty.setAlignment(Element.ALIGN_CENTER);
                document.add(empty);
            }

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate single table PDF", e);
            throw new RuntimeException("Failed to generate table export: " + e.getMessage(), e);
        }
    }

    private void addHeaderCell(PdfPTable table, String text, Font font, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setPadding(5);
        table.addCell(cell);
    }

    private int getSeatedCount(SeatingTable table) {
        List<Household> households = table.getHouseholds() != null ? table.getHouseholds() : Collections.emptyList();
        return households.stream()
                .flatMap(h -> (h.getMembers() != null ? h.getMembers() : Collections.<Guest>emptyList()).stream())
                .mapToInt(g -> (g.getAdults() != null ? g.getAdults() : 1) + (g.getChildren() != null ? g.getChildren() : 0))
                .sum();
    }

    private byte[] convertToJpeg(byte[] pdfBytes) {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFRenderer renderer = new PDFRenderer(document);
            BufferedImage image = renderer.renderImageWithDPI(0, 300);
            ByteArrayOutputStream jpegOut = new ByteArrayOutputStream();
            ImageIO.write(image, "JPEG", jpegOut);
            return jpegOut.toByteArray();
        } catch (Exception e) {
            log.error("Failed to convert seating plan to JPEG", e);
            throw new RuntimeException("Failed to convert to JPEG: " + e.getMessage(), e);
        }
    }
}
