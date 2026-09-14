package org.example.d1w17.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final SecureRandom random = new SecureRandom();

    private final JavaMailSender mailSender;

    public void invia(String destinatario, String oggetto, String testo) {
        SimpleMailMessage messaggio = new SimpleMailMessage();
        messaggio.setTo(destinatario);
        messaggio.setSubject(oggetto);
        messaggio.setText(testo);
        mailSender.send(messaggio);
    }

    // codice numerico di 6 cifre da mandare per email
    public String generaCodice() {
        return String.format("%06d", random.nextInt(1_000_000));
    }
}
