package com.BackPM.BackPM.services.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BackPM.BackPM.models.Usuarios;
import com.BackPM.BackPM.repositories.IBaseRepository;
import com.BackPM.BackPM.repositories.IUsuariosRepository;
import com.BackPM.BackPM.services.IService.IUsuariosService;

@Service
public class UsuariosServiceImpl extends ABaseService<Usuarios> implements IUsuariosService {

    @Autowired
    private IUsuariosRepository usuariosRepository;

    @Override
    protected IBaseRepository<Usuarios, Long> getRepository() {
        return usuariosRepository;
    }
}
