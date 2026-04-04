package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.Expense;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByWorkspaceId(Long workspaceId);

    List<Expense> findByWorkspaceIdAndDateBetween(Long workspaceId, LocalDate start, LocalDate end);
}
