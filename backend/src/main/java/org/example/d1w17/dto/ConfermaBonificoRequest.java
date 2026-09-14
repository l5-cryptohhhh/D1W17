package org.example.d1w17.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfermaBonificoRequest(
        @NotBlank(message = "il codice e' obbligatorio")
        String codice) {
}
