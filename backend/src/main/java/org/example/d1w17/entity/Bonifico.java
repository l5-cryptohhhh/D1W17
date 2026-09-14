package org.example.d1w17.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "bonifici")
@Getter
@Setter
@NoArgsConstructor
public class Bonifico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Conto contoPartenza;

    @ManyToOne(optional = false)
    private Conto contoDestinazione;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal importo;

    @Column(nullable = false)
    private String codice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatoBonifico stato;
}
