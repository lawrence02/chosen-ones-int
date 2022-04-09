package com.ones.chosen.repository;

import com.ones.chosen.domain.Finance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Finance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FinanceRepository extends JpaRepository<Finance, Long> {}
