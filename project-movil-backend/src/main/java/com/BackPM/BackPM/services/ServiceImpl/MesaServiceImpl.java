package com.BackPM.BackPM.services.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BackPM.BackPM.models.Mesas;
import com.BackPM.BackPM.repositories.IBaseRepository;
import com.BackPM.BackPM.repositories.IMesasRepository;
import com.BackPM.BackPM.services.IService.IMesaService;

@Service
public class MesaServiceImpl extends ABaseService<Mesas> implements IMesaService {

    @Autowired
    private IMesasRepository mesaRepository;

    @Override
    protected IBaseRepository<Mesas, Long> getRepository() {
        return mesaRepository;
    }
}
