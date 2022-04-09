package com.ones.chosen.service.impl;

import com.ones.chosen.domain.Person;
import com.ones.chosen.repository.PersonRepository;
import com.ones.chosen.service.PersonService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Person}.
 */
@Service
@Transactional
public class PersonServiceImpl implements PersonService {

    private final Logger log = LoggerFactory.getLogger(PersonServiceImpl.class);

    private final PersonRepository personRepository;

    public PersonServiceImpl(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public Person save(Person person) {
        log.debug("Request to save Person : {}", person);
        return personRepository.save(person);
    }

    @Override
    public Person update(Person person) {
        log.debug("Request to save Person : {}", person);
        return personRepository.save(person);
    }

    @Override
    public Optional<Person> partialUpdate(Person person) {
        log.debug("Request to partially update Person : {}", person);

        return personRepository
            .findById(person.getId())
            .map(existingPerson -> {
                if (person.getFirstname() != null) {
                    existingPerson.setFirstname(person.getFirstname());
                }
                if (person.getLastname() != null) {
                    existingPerson.setLastname(person.getLastname());
                }
                if (person.getDob() != null) {
                    existingPerson.setDob(person.getDob());
                }
                if (person.getGender() != null) {
                    existingPerson.setGender(person.getGender());
                }
                if (person.getOccupation() != null) {
                    existingPerson.setOccupation(person.getOccupation());
                }
                if (person.getPhone() != null) {
                    existingPerson.setPhone(person.getPhone());
                }
                if (person.getBaptized() != null) {
                    existingPerson.setBaptized(person.getBaptized());
                }
                if (person.getMaritalStatus() != null) {
                    existingPerson.setMaritalStatus(person.getMaritalStatus());
                }
                if (person.getNationality() != null) {
                    existingPerson.setNationality(person.getNationality());
                }
                if (person.getMinistry() != null) {
                    existingPerson.setMinistry(person.getMinistry());
                }

                return existingPerson;
            })
            .map(personRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Person> findAll(Pageable pageable) {
        log.debug("Request to get all People");
        return personRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Person> findOne(Long id) {
        log.debug("Request to get Person : {}", id);
        return personRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Person : {}", id);
        personRepository.deleteById(id);
    }
}
