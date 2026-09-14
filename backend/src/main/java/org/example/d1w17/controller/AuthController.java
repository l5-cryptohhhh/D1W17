package org.example.d1w17.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.d1w17.dto.LoginCodiceRequest;
import org.example.d1w17.dto.LoginRequest;
import org.example.d1w17.dto.RegistrazioneRequest;
import org.example.d1w17.dto.RichiestaCodiceRequest;
import org.example.d1w17.dto.UtenteResponse;
import org.example.d1w17.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registrazione")
    @ResponseStatus(HttpStatus.CREATED)
    public String registrazione(@Valid @RequestBody RegistrazioneRequest request) {
        authService.registra(request);
        return "Registrazione completata, controlla la tua email per confermare l'account";
    }

    // link che arriva nella mail di conferma
    @GetMapping("/conferma")
    public String conferma(@RequestParam String token) {
        authService.confermaAccount(token);
        return "Account confermato, adesso puoi accedere";
    }

    @PostMapping("/login")
    public UtenteResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/codice")
    public String richiediCodice(@Valid @RequestBody RichiestaCodiceRequest request) {
        authService.inviaCodiceAccesso(request.email());
        return "Codice inviato alla tua email";
    }

    @PostMapping("/login-codice")
    public UtenteResponse loginConCodice(@Valid @RequestBody LoginCodiceRequest request) {
        return authService.loginConCodice(request);
    }
}
