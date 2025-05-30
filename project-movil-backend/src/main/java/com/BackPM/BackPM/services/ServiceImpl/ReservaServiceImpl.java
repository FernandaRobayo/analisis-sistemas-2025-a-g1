package com.BackPM.BackPM.services.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BackPM.BackPM.models.Reservas;
import com.BackPM.BackPM.repositories.IBaseRepository;
import com.BackPM.BackPM.repositories.IReservasRepository;
import com.BackPM.BackPM.services.IService.IReservaService;

@Service
public class ReservaServiceImpl extends ABaseService<Reservas> implements IReservaService {

    @Autowired
    private IReservasRepository reservaRepository;

    @Override
    protected IBaseRepository<Reservas, Long> getRepository() {
        return reservaRepository;
    }
}
