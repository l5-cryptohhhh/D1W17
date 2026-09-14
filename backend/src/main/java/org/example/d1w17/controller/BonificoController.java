package org.example.d1w17.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.d1w17.dto.BonificoRequest;
import org.example.d1w17.dto.BonificoResponse;
import org.example.d1w17.dto.ConfermaBonificoRequest;
import org.example.d1w17.service.BonificoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bonifici")
@RequiredArgsConstructor
public class BonificoController {

    private final BonificoService bonificoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BonificoResponse crea(@Valid @RequestBody BonificoRequest request) {
        return bonificoService.crea(request);
    }

    @PostMapping("/{id}/conferma")
    public BonificoResponse conferma(@PathVariable Long id, @Valid @RequestBody ConfermaBonificoRequest request) {
        return bonificoService.conferma(id, request.codice());
    }
}
