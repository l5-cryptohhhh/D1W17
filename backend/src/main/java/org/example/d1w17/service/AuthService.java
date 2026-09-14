package org.example.d1w17.service;

import lombok.RequiredArgsConstructor;
import org.example.d1w17.dto.LoginCodiceRequest;
import org.example.d1w17.dto.LoginRequest;
import org.example.d1w17.dto.RegistrazioneRequest;
import org.example.d1w17.dto.UtenteResponse;
import org.example.d1w17.entity.Conto;
import org.example.d1w17.entity.Utente;
import org.example.d1w17.exception.ApiException;
import org.example.d1w17.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtenteRepository utenteRepository;
    private final EmailService emailService;

    @Value("${app.url}")
    private String appUrl;

    @Transactional
    public void registra(RegistrazioneRequest request) {
        if (utenteRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "Email gia' registrata");
        }

        Conto conto = new Conto();
        conto.setSaldo(request.importoIniziale());

        Utente utente = new Utente();
        utente.setNome(request.nome());
        utente.setCognome(request.cognome());
        utente.setEmail(request.email());
        utente.setPassword(request.password());
        utente.setAttivo(false);
        utente.setTokenConferma(UUID.randomUUID().toString());
        utente.setConto(conto);
        utenteRepository.save(utente);

        String link = appUrl + "/api/auth/conferma?token=" + utente.getTokenConferma();
        emailService.invia(utente.getEmail(), "Conferma la tua registrazione",
                "Ciao " + utente.getNome() + ",\nper attivare il tuo account apri questo link:\n" + link);
    }

    @Transactional
    public void confermaAccount(String token) {
        Utente utente = utenteRepository.findByTokenConferma(token)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Link di conferma non valido"));
        utente.setAttivo(true);
        utente.setTokenConferma(null);
    }

    @Transactional(readOnly = true)
    public UtenteResponse login(LoginRequest request) {
        Utente utente = utenteRepository.findByEmail(request.email())
                .filter(u -> u.getPassword().equals(request.password()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email o password errati"));
        controllaAttivo(utente);
        return UtenteResponse.from(utente);
    }

    @Transactional
    public void inviaCodiceAccesso(String email) {
        Utente utente = utenteRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Nessun account registrato con questa email"));
        controllaAttivo(utente);

        utente.setCodiceAccesso(emailService.generaCodice());
        emailService.invia(utente.getEmail(), "Codice di accesso",
                "Il tuo codice per accedere e': " + utente.getCodiceAccesso());
    }

    @Transactional
    public UtenteResponse loginConCodice(LoginCodiceRequest request) {
        Utente utente = utenteRepository.findByEmail(request.email())
                .filter(u -> request.codice().equals(u.getCodiceAccesso()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Codice non valido"));
        controllaAttivo(utente);

        // il codice vale una volta sola
        utente.setCodiceAccesso(null);
        return UtenteResponse.from(utente);
    }

    private void controllaAttivo(Utente utente) {
        if (!utente.isAttivo()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Account non ancora confermato, controlla la tua email");
        }
    }
}
