package pl.piomin.services.model.enums;

import lombok.Getter;

@Getter
public enum InvitationTemplate {

    CLASSIC("Classic Elegance", "Timeless serif typography with gold accents"),
    MODERN("Modern Minimalist", "Clean sans-serif design with geometric elements"),
    FLORAL("Garden Romance", "Soft watercolor florals and script fonts"),
    RUSTIC("Rustic Charm", "Earthy tones with handwritten-style lettering");

    private final String displayName;
    private final String description;

    InvitationTemplate(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}
