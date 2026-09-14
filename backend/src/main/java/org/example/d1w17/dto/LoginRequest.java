package org.example.d1w17.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "l'email e' obbligatoria")
        String email,

        @NotBlank(message = "la password e' obbligatoria")
        String password) {
}
