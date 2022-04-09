package com.ones.chosen.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ones.chosen.domain.enumeration.BAPTIZED;
import com.ones.chosen.domain.enumeration.Gender;
import com.ones.chosen.domain.enumeration.MARITALSTATUS;
import com.ones.chosen.domain.enumeration.MINISTRY;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Person.
 */
@Entity
@Table(name = "person")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Person implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "firstname")
    private String firstname;

    @Column(name = "lastname")
    private String lastname;

    @Column(name = "dob")
    private Instant dob;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "baptized")
    private BAPTIZED baptized;

    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status")
    private MARITALSTATUS maritalStatus;

    @Column(name = "nationality")
    private String nationality;

    @Enumerated(EnumType.STRING)
    @Column(name = "ministry")
    private MINISTRY ministry;

    @OneToMany(mappedBy = "person")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "person" }, allowSetters = true)
    private Set<Address> addresses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Person id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return this.firstname;
    }

    public Person firstname(String firstname) {
        this.setFirstname(firstname);
        return this;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return this.lastname;
    }

    public Person lastname(String lastname) {
        this.setLastname(lastname);
        return this;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Instant getDob() {
        return this.dob;
    }

    public Person dob(Instant dob) {
        this.setDob(dob);
        return this;
    }

    public void setDob(Instant dob) {
        this.dob = dob;
    }

    public Gender getGender() {
        return this.gender;
    }

    public Person gender(Gender gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getOccupation() {
        return this.occupation;
    }

    public Person occupation(String occupation) {
        this.setOccupation(occupation);
        return this;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getPhone() {
        return this.phone;
    }

    public Person phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public BAPTIZED getBaptized() {
        return this.baptized;
    }

    public Person baptized(BAPTIZED baptized) {
        this.setBaptized(baptized);
        return this;
    }

    public void setBaptized(BAPTIZED baptized) {
        this.baptized = baptized;
    }

    public MARITALSTATUS getMaritalStatus() {
        return this.maritalStatus;
    }

    public Person maritalStatus(MARITALSTATUS maritalStatus) {
        this.setMaritalStatus(maritalStatus);
        return this;
    }

    public void setMaritalStatus(MARITALSTATUS maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getNationality() {
        return this.nationality;
    }

    public Person nationality(String nationality) {
        this.setNationality(nationality);
        return this;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public MINISTRY getMinistry() {
        return this.ministry;
    }

    public Person ministry(MINISTRY ministry) {
        this.setMinistry(ministry);
        return this;
    }

    public void setMinistry(MINISTRY ministry) {
        this.ministry = ministry;
    }

    public Set<Address> getAddresses() {
        return this.addresses;
    }

    public void setAddresses(Set<Address> addresses) {
        if (this.addresses != null) {
            this.addresses.forEach(i -> i.setPerson(null));
        }
        if (addresses != null) {
            addresses.forEach(i -> i.setPerson(this));
        }
        this.addresses = addresses;
    }

    public Person addresses(Set<Address> addresses) {
        this.setAddresses(addresses);
        return this;
    }

    public Person addAddress(Address address) {
        this.addresses.add(address);
        address.setPerson(this);
        return this;
    }

    public Person removeAddress(Address address) {
        this.addresses.remove(address);
        address.setPerson(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Person)) {
            return false;
        }
        return id != null && id.equals(((Person) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Person{" +
            "id=" + getId() +
            ", firstname='" + getFirstname() + "'" +
            ", lastname='" + getLastname() + "'" +
            ", dob='" + getDob() + "'" +
            ", gender='" + getGender() + "'" +
            ", occupation='" + getOccupation() + "'" +
            ", phone='" + getPhone() + "'" +
            ", baptized='" + getBaptized() + "'" +
            ", maritalStatus='" + getMaritalStatus() + "'" +
            ", nationality='" + getNationality() + "'" +
            ", ministry='" + getMinistry() + "'" +
            "}";
    }
}
