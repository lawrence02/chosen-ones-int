package com.ones.chosen.service.impl;

import com.ones.chosen.domain.Finance;
import com.ones.chosen.repository.FinanceRepository;
import com.ones.chosen.service.FinanceService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Finance}.
 */
@Service
@Transactional
public class FinanceServiceImpl implements FinanceService {

    private final Logger log = LoggerFactory.getLogger(FinanceServiceImpl.class);

    private final FinanceRepository financeRepository;

    public FinanceServiceImpl(FinanceRepository financeRepository) {
        this.financeRepository = financeRepository;
    }

    @Override
    public Finance save(Finance finance) {
        log.debug("Request to save Finance : {}", finance);
        return financeRepository.save(finance);
    }

    @Override
    public Finance update(Finance finance) {
        log.debug("Request to save Finance : {}", finance);
        return financeRepository.save(finance);
    }

    @Override
    public Optional<Finance> partialUpdate(Finance finance) {
        log.debug("Request to partially update Finance : {}", finance);

        return financeRepository
            .findById(finance.getId())
            .map(existingFinance -> {
                if (finance.getDate() != null) {
                    existingFinance.setDate(finance.getDate());
                }
                if (finance.getAmount() != null) {
                    existingFinance.setAmount(finance.getAmount());
                }
                if (finance.getPaymentType() != null) {
                    existingFinance.setPaymentType(finance.getPaymentType());
                }

                return existingFinance;
            })
            .map(financeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Finance> findAll() {
        log.debug("Request to get all Finances");
        return financeRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Finance> findOne(Long id) {
        log.debug("Request to get Finance : {}", id);
        return financeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Finance : {}", id);
        financeRepository.deleteById(id);
    }
}
