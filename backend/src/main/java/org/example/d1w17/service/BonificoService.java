package org.example.d1w17.service;

import lombok.RequiredArgsConstructor;
import org.example.d1w17.dto.BonificoRequest;
import org.example.d1w17.dto.BonificoResponse;
import org.example.d1w17.entity.Bonifico;
import org.example.d1w17.entity.Conto;
import org.example.d1w17.entity.StatoBonifico;
import org.example.d1w17.exception.ApiException;
import org.example.d1w17.repository.BonificoRepository;
import org.example.d1w17.repository.ContoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BonificoService {

    private final BonificoRepository bonificoRepository;
    private final ContoRepository contoRepository;
    private final EmailService emailService;

    @Transactional
    public BonificoResponse crea(BonificoRequest request) {
        if (request.contoPartenzaId().equals(request.contoDestinazioneId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Il conto di partenza e quello di destinazione devono essere diversi");
        }
        Conto partenza = trovaConto(request.contoPartenzaId());
        Conto destinazione = trovaConto(request.contoDestinazioneId());

        // il bonifico viene solo salvato, i soldi si muovono dopo la conferma col codice
        Bonifico bonifico = new Bonifico();
        bonifico.setContoPartenza(partenza);
        bonifico.setContoDestinazione(destinazione);
        bonifico.setImporto(request.importo());
        bonifico.setCodice(emailService.generaCodice());
        bonifico.setStato(StatoBonifico.IN_ATTESA);
        bonificoRepository.save(bonifico);

        emailService.invia(partenza.getUtente().getEmail(), "Autorizza il tuo bonifico",
                "E' stato richiesto un bonifico di " + bonifico.getImporto() + " euro verso il conto n. " + destinazione.getId()
                        + ".\nPer autorizzarlo usa questo codice: " + bonifico.getCodice());

        return BonificoResponse.from(bonifico);
    }

    @Transactional
    public BonificoResponse conferma(Long id, String codice) {
        Bonifico bonifico = bonificoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Bonifico non trovato"));

        if (bonifico.getStato() != StatoBonifico.IN_ATTESA) {
            throw new ApiException(HttpStatus.CONFLICT, "Il bonifico e' gia' stato eseguito");
        }
        if (!bonifico.getCodice().equals(codice)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Codice non corretto");
        }

        Conto partenza = bonifico.getContoPartenza();
        Conto destinazione = bonifico.getContoDestinazione();
        if (partenza.getSaldo().compareTo(bonifico.getImporto()) < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Saldo insufficiente");
        }

        partenza.setSaldo(partenza.getSaldo().subtract(bonifico.getImporto()));
        destinazione.setSaldo(destinazione.getSaldo().add(bonifico.getImporto()));
        bonifico.setStato(StatoBonifico.ESEGUITO);

        return BonificoResponse.from(bonifico);
    }

    private Conto trovaConto(Long id) {
        return contoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Conto " + id + " non trovato"));
    }
}
