package org.example.d1w17.dto;

import org.example.d1w17.entity.Bonifico;
import org.example.d1w17.entity.StatoBonifico;

import java.math.BigDecimal;

public record BonificoResponse(Long id, Long contoPartenzaId, Long contoDestinazioneId, BigDecimal importo, StatoBonifico stato) {

    public static BonificoResponse from(Bonifico bonifico) {
        return new BonificoResponse(
                bonifico.getId(),
                bonifico.getContoPartenza().getId(),
                bonifico.getContoDestinazione().getId(),
                bonifico.getImporto(),
                bonifico.getStato());
    }
}
