package pl.piomin.services.repository;

import org.springframework.data.jpa.domain.Specification;
import pl.piomin.services.model.entity.Guest;
import pl.piomin.services.model.enums.GuestCategory;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;

public final class GuestSpecifications {

    private GuestSpecifications() {
    }

    public static Specification<Guest> inWorkspace(Long workspaceId) {
        return (root, query, cb) -> cb.equal(root.get("workspace").get("id"), workspaceId);
    }

    public static Specification<Guest> hasStatus(GuestStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Guest> hasSide(GuestSide side) {
        return (root, query, cb) -> cb.equal(root.get("side"), side);
    }

    public static Specification<Guest> hasCategory(GuestCategory category) {
        return (root, query, cb) -> cb.equal(root.get("category"), category);
    }

    public static Specification<Guest> inHousehold(Long householdId) {
        return (root, query, cb) -> cb.equal(root.get("household").get("id"), householdId);
    }

    public static Specification<Guest> nameContains(String search) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
    }
}
