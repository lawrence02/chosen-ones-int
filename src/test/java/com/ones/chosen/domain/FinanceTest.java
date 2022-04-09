package com.ones.chosen.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ones.chosen.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FinanceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Finance.class);
        Finance finance1 = new Finance();
        finance1.setId(1L);
        Finance finance2 = new Finance();
        finance2.setId(finance1.getId());
        assertThat(finance1).isEqualTo(finance2);
        finance2.setId(2L);
        assertThat(finance1).isNotEqualTo(finance2);
        finance1.setId(null);
        assertThat(finance1).isNotEqualTo(finance2);
    }
}
