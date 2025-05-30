package com.BackPM.BackPM.services.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BackPM.BackPM.models.Clientes;
import com.BackPM.BackPM.repositories.IBaseRepository;
import com.BackPM.BackPM.repositories.IClientesRepository;
import com.BackPM.BackPM.services.IService.IClienteService;

@Service
public class ClienteServiceImpl extends ABaseService<Clientes> implements IClienteService {

    @Autowired
    private IClientesRepository clienteRepository;

    @Override
    protected IBaseRepository<Clientes, Long> getRepository() {
        return clienteRepository;
    }
}
