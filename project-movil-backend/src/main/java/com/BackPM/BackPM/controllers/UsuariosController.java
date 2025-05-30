package com.BackPM.BackPM.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BackPM.BackPM.models.Usuarios;
import com.BackPM.BackPM.services.IService.IUsuariosService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/usuarios")
public class UsuariosController extends ABaseController<Usuarios, IUsuariosService> {

    public UsuariosController(IUsuariosService service) {
        super(service, "Usuarios");
    }
}
