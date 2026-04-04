package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.UserDevice;

import java.util.List;
import java.util.Optional;

public interface UserDeviceRepository extends JpaRepository<UserDevice, Long> {

    List<UserDevice> findByUserIdAndIsActiveTrue(Long userId);

    Optional<UserDevice> findByFcmToken(String fcmToken);

    void deleteByFcmToken(String fcmToken);
}
