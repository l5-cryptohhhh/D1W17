package org.example.d1w17.dto;

import jakarta.validation.constraints.NotBlank;

public record RichiestaCodiceRequest(
        @NotBlank(message = "l'email e' obbligatoria")
        String email) {
}
