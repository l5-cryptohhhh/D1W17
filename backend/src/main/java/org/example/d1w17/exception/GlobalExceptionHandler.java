package org.example.d1w17.exception;

import org.example.d1w17.dto.ErroreResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErroreResponse> handleApiException(ApiException ex) {
        return ResponseEntity.status(ex.getStatus())
                .body(new ErroreResponse(ex.getStatus().value(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroreResponse> handleValidation(MethodArgumentNotValidException ex) {
        String messaggio = ex.getBindingResult().getFieldErrors().stream()
                .map(errore -> errore.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
                .body(new ErroreResponse(HttpStatus.BAD_REQUEST.value(), messaggio));
    }

    // es. credenziali gmail sbagliate: la transazione viene annullata, niente utente salvato
    @ExceptionHandler(MailException.class)
    public ResponseEntity<ErroreResponse> handleMail(MailException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ErroreResponse(HttpStatus.SERVICE_UNAVAILABLE.value(),
                        "Impossibile inviare l'email, riprova piu' tardi"));
    }
}
