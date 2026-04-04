package pl.piomin.services.mapper;

import pl.piomin.services.model.dto.response.GuestResponse;
import pl.piomin.services.model.dto.response.HouseholdResponse;
import pl.piomin.services.model.dto.response.UserResponse;
import pl.piomin.services.model.entity.Guest;
import pl.piomin.services.model.entity.Household;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.enums.GuestStatus;

import java.util.Collections;
import java.util.List;

public final class EntityMapper {

    private EntityMapper() {
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .age(user.getAge())
                .gender(user.getGender())
                .email(user.getEmail())
                .phone(user.getPhone())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public static HouseholdResponse toHouseholdResponse(Household household) {
        List<Guest> members = household.getMembers() != null ? household.getMembers() : Collections.emptyList();

        List<GuestResponse> memberResponses = members.stream()
                .map(EntityMapper::toGuestResponse)
                .toList();

        int totalMembers = members.stream()
                .mapToInt(g -> (g.getAdults() != null ? g.getAdults() : 1) + (g.getChildren() != null ? g.getChildren() : 0))
                .sum();

        HouseholdResponse.RsvpSummary rsvpSummary = HouseholdResponse.RsvpSummary.builder()
                .total(members.size())
                .confirmed((int) members.stream().filter(g -> g.getStatus() == GuestStatus.CONFIRMED).count())
                .pending((int) members.stream().filter(g -> g.getStatus() == GuestStatus.PENDING).count())
                .declined((int) members.stream().filter(g -> g.getStatus() == GuestStatus.NOT_INVITED).count())
                .build();

        HouseholdResponse.HouseholdResponseBuilder builder = HouseholdResponse.builder()
                .id(household.getId())
                .householdName(household.getHouseholdName())
                .formalAddress(household.getFormalAddress())
                .addressStyle(household.getAddressStyle())
                .headGuestId(household.getHeadGuestId())
                .totalMembers(totalMembers)
                .rsvpSummary(rsvpSummary)
                .members(memberResponses);

        if (household.getAssignedTable() != null) {
            builder.assignedTableId(household.getAssignedTable().getId());
            builder.assignedTableName(household.getAssignedTable().getName());
        }

        return builder.build();
    }

    public static GuestResponse toGuestResponse(Guest guest) {
        GuestResponse.GuestResponseBuilder builder = GuestResponse.builder()
                .id(guest.getId())
                .name(guest.getName())
                .title(guest.getTitle())
                .avatarUrl(guest.getAvatarUrl())
                .side(guest.getSide())
                .status(guest.getStatus())
                .category(guest.getCategory())
                .phone(guest.getPhone())
                .email(guest.getEmail())
                .adults(guest.getAdults())
                .children(guest.getChildren())
                .dietary(guest.getDietary())
                .isVip(guest.isVip())
                .isHeadOfHousehold(guest.isHeadOfHousehold())
                .notes(guest.getNotes());

        if (guest.getHousehold() != null) {
            builder.householdId(guest.getHousehold().getId());
            builder.householdName(guest.getHousehold().getHouseholdName());
        }

        return builder.build();
    }
}
