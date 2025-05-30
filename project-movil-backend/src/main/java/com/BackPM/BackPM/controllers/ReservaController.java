package com.BackPM.BackPM.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BackPM.BackPM.models.Reservas;
import com.BackPM.BackPM.services.IService.IReservaService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/reservas")
public class ReservaController extends ABaseController<Reservas, IReservaService> {

    public ReservaController(IReservaService service) {
        super(service, "Reserva");
    }
}
