package org.example.d1w17.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record BonificoRequest(
        @NotNull(message = "il conto di partenza e' obbligatorio")
        Long contoPartenzaId,

        @NotNull(message = "il conto di destinazione e' obbligatorio")
        Long contoDestinazioneId,

        @NotNull(message = "l'importo e' obbligatorio")
        @Positive(message = "l'importo deve essere maggiore di zero")
        BigDecimal importo) {
}
