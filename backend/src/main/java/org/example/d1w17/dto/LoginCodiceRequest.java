package org.example.d1w17.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginCodiceRequest(
        @NotBlank(message = "l'email e' obbligatoria")
        String email,

        @NotBlank(message = "il codice e' obbligatorio")
        String codice) {
}
