package org.example.d1w17.dto;

import org.example.d1w17.entity.Utente;

import java.math.BigDecimal;

public record UtenteResponse(Long id, String nome, String cognome, String email, Long contoId, BigDecimal saldo) {

    public static UtenteResponse from(Utente utente) {
        return new UtenteResponse(
                utente.getId(),
                utente.getNome(),
                utente.getCognome(),
                utente.getEmail(),
                utente.getConto().getId(),
                utente.getConto().getSaldo());
    }
}
