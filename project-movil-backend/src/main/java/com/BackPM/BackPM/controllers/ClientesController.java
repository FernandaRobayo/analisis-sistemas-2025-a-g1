package com.BackPM.BackPM.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BackPM.BackPM.models.Clientes;
import com.BackPM.BackPM.services.IService.IClienteService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/clientes")
public class ClientesController extends ABaseController<Clientes, IClienteService> {

    public ClientesController(IClienteService service) {
        super(service, "Cliente");
    }
}
