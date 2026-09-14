package org.example.d1w17.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record RegistrazioneRequest(
        @NotBlank(message = "il nome e' obbligatorio")
        String nome,

        @NotBlank(message = "il cognome e' obbligatorio")
        String cognome,

        @NotBlank(message = "l'email e' obbligatoria")
        @Email(message = "email non valida")
        String email,

        @NotBlank(message = "la password e' obbligatoria")
        String password,

        @NotNull(message = "l'importo iniziale e' obbligatorio")
        @PositiveOrZero(message = "l'importo iniziale non puo' essere negativo")
        BigDecimal importoIniziale) {
}
