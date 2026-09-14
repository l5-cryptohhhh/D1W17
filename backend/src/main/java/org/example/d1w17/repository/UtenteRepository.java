package org.example.d1w17.repository;

import org.example.d1w17.entity.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtenteRepository extends JpaRepository<Utente, Long> {

    Optional<Utente> findByEmail(String email);

    Optional<Utente> findByTokenConferma(String tokenConferma);

    boolean existsByEmail(String email);
}
