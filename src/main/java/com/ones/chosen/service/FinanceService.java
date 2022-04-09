package com.ones.chosen.service;

import com.ones.chosen.domain.Finance;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Finance}.
 */
public interface FinanceService {
    /**
     * Save a finance.
     *
     * @param finance the entity to save.
     * @return the persisted entity.
     */
    Finance save(Finance finance);

    /**
     * Updates a finance.
     *
     * @param finance the entity to update.
     * @return the persisted entity.
     */
    Finance update(Finance finance);

    /**
     * Partially updates a finance.
     *
     * @param finance the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Finance> partialUpdate(Finance finance);

    /**
     * Get all the finances.
     *
     * @return the list of entities.
     */
    List<Finance> findAll();

    /**
     * Get the "id" finance.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Finance> findOne(Long id);

    /**
     * Delete the "id" finance.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
