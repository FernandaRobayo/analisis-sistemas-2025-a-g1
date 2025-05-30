package com.BackPM.BackPM.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Mesas extends ABaseEntity {

    @Column(name = "numero", nullable = false)
    private int numero;

    @Column(name = "capacidad", nullable = false)
    private int capacidad;

    @Column(name = "disponible", nullable = true)
    private Boolean disponible;

    // Getters and Setters
    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public int getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(int capacidad) {
        this.capacidad = capacidad;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
