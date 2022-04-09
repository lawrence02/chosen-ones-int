package com.ones.chosen.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ones.chosen.IntegrationTest;
import com.ones.chosen.domain.Finance;
import com.ones.chosen.domain.enumeration.PaymentType;
import com.ones.chosen.repository.FinanceRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FinanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FinanceResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_AMOUNT = 1L;
    private static final Long UPDATED_AMOUNT = 2L;

    private static final PaymentType DEFAULT_PAYMENT_TYPE = PaymentType.OFFERING;
    private static final PaymentType UPDATED_PAYMENT_TYPE = PaymentType.TITHE;

    private static final String ENTITY_API_URL = "/api/finances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FinanceRepository financeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFinanceMockMvc;

    private Finance finance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Finance createEntity(EntityManager em) {
        Finance finance = new Finance().date(DEFAULT_DATE).amount(DEFAULT_AMOUNT).paymentType(DEFAULT_PAYMENT_TYPE);
        return finance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Finance createUpdatedEntity(EntityManager em) {
        Finance finance = new Finance().date(UPDATED_DATE).amount(UPDATED_AMOUNT).paymentType(UPDATED_PAYMENT_TYPE);
        return finance;
    }

    @BeforeEach
    public void initTest() {
        finance = createEntity(em);
    }

    @Test
    @Transactional
    void createFinance() throws Exception {
        int databaseSizeBeforeCreate = financeRepository.findAll().size();
        // Create the Finance
        restFinanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finance)))
            .andExpect(status().isCreated());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeCreate + 1);
        Finance testFinance = financeList.get(financeList.size() - 1);
        assertThat(testFinance.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFinance.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testFinance.getPaymentType()).isEqualTo(DEFAULT_PAYMENT_TYPE);
    }

    @Test
    @Transactional
    void createFinanceWithExistingId() throws Exception {
        // Create the Finance with an existing ID
        finance.setId(1L);

        int databaseSizeBeforeCreate = financeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFinanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finance)))
            .andExpect(status().isBadRequest());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFinances() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        // Get all the financeList
        restFinanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finance.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].paymentType").value(hasItem(DEFAULT_PAYMENT_TYPE.toString())));
    }

    @Test
    @Transactional
    void getFinance() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        // Get the finance
        restFinanceMockMvc
            .perform(get(ENTITY_API_URL_ID, finance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(finance.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.intValue()))
            .andExpect(jsonPath("$.paymentType").value(DEFAULT_PAYMENT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFinance() throws Exception {
        // Get the finance
        restFinanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFinance() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        int databaseSizeBeforeUpdate = financeRepository.findAll().size();

        // Update the finance
        Finance updatedFinance = financeRepository.findById(finance.getId()).get();
        // Disconnect from session so that the updates on updatedFinance are not directly saved in db
        em.detach(updatedFinance);
        updatedFinance.date(UPDATED_DATE).amount(UPDATED_AMOUNT).paymentType(UPDATED_PAYMENT_TYPE);

        restFinanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFinance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFinance))
            )
            .andExpect(status().isOk());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
        Finance testFinance = financeList.get(financeList.size() - 1);
        assertThat(testFinance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFinance.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testFinance.getPaymentType()).isEqualTo(UPDATED_PAYMENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingFinance() throws Exception {
        int databaseSizeBeforeUpdate = financeRepository.findAll().size();
        finance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, finance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFinance() throws Exception {
        int databaseSizeBeforeUpdate = financeRepository.findAll().size();
        finance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(finance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFinance() throws Exception {
        int databaseSizeBeforeUpdate = financeRepository.findAll().size();
        finance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinanceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(finance)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFinanceWithPatch() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        int databaseSizeBeforeUpdate = financeRepository.findAll().size();

        // Update the finance using partial update
        Finance partialUpdatedFinance = new Finance();
        partialUpdatedFinance.setId(finance.getId());

        partialUpdatedFinance.date(UPDATED_DATE);

        restFinanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinance))
            )
            .andExpect(status().isOk());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
        Finance testFinance = financeList.get(financeList.size() - 1);
        assertThat(testFinance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFinance.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testFinance.getPaymentType()).isEqualTo(DEFAULT_PAYMENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateFinanceWithPatch() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        int databaseSizeBeforeUpdate = financeRepository.findAll().size();

        // Update the finance using partial update
        Finance partialUpdatedFinance = new Finance();
        partialUpdatedFinance.setId(finance.getId());

        partialUpdatedFinance.date(UPDATED_DATE).amount(UPDATED_AMOUNT).paymentType(UPDATED_PAYMENT_TYPE);

        restFinanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinance))
            )
            .andExpect(status().isOk());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
        Finance testFinance = financeList.get(financeList.size() - 1);
        assertThat(testFinance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFinance.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testFinance.getPaymentType()).isEqualTo(UPDATED_PAYMENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingFinance() throws Exception {
        int databaseSizeBeforeUpdate = financeRepository.findAll().size();
        finance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, finance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(finance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFinance() throws Exception {
        int databaseSizeBeforeUpdate = financeRepository.findAll().size();
        finance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(finance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFinance() throws Exception {
        int databaseSizeBeforeUpdate = financeRepository.findAll().size();
        finance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinanceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(finance)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Finance in the database
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFinance() throws Exception {
        // Initialize the database
        financeRepository.saveAndFlush(finance);

        int databaseSizeBeforeDelete = financeRepository.findAll().size();

        // Delete the finance
        restFinanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, finance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Finance> financeList = financeRepository.findAll();
        assertThat(financeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
