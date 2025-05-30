package com.BackPM.BackPM.services.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;

import com.BackPM.BackPM.models.ABaseEntity;
import com.BackPM.BackPM.repositories.IBaseRepository;
import com.BackPM.BackPM.services.IService.IBaseService;


public abstract class ABaseService<T extends ABaseEntity> implements IBaseService<T> {

    protected abstract IBaseRepository<T, Long> getRepository();

    @Override
    public List<T> all() {
        return getRepository().findAll();
    }

    @Override
    public List<T> findByStateTrue() {
        return getRepository().findAll();
    }

    @Override
    public T findById(Long id) throws Exception {
        Optional<T> op = getRepository().findById(id);

        if (op.isEmpty()) {
            throw new Exception("Registro no encontrado");
        }

        return op.get();
    }
    @Override
    public T save(T entity) throws Exception{
        try {

            entity.setCreatedBy(1L);
            entity.setCreatedAt(LocalDateTime.now());
            return getRepository().save(entity);
        } catch (Exception e) {
            throw new Exception("Error al guardar la entidad: " + e.getMessage());
        }
    }

    @Override
    public void update(Long id, T entity) throws Exception {
        Optional<T> op = getRepository().findById(id);

        if (op.isEmpty()) {
            throw new Exception("Registro no encontrado");
        }else if(op.get().getUpdatedAt() != null) {
            throw new Exception("Registro inhabilitado");
        }

        T entityUpdate = op.get();

        String[] ignoreProperties = {"id","createdAt","deleteAt","createdBy","deletedBy"};
        BeanUtils.copyProperties(entity, entityUpdate,ignoreProperties);
        entityUpdate.setUpdatedBy(2L);
        entityUpdate.setUpdatedAt(LocalDateTime.now());
        getRepository().save(entityUpdate);
    }

    @Override
    public void delete(Long id) throws Exception {
        Optional<T> op = getRepository().findById(id);

        if (op.isEmpty()) {
            throw new Exception("Registro no encontrado");
        }

        T entityUpdate = op.get();
        entityUpdate.setDeletedBy(3L);
        entityUpdate.setDeletedAt(LocalDateTime.now());

        getRepository().save(entityUpdate);
    }
    @Override
    public void setStatus(Long id, boolean state) {
        T entityUpdate = getRepository().findById(id).orElseThrow(() -> new RuntimeException("Entity with ID " + id + " not found"));
        entityUpdate.setDeletedBy(3L);
        entityUpdate.setDeletedAt(LocalDateTime.now());
        entityUpdate.setStatus(state);
        getRepository().save(entityUpdate);
    }
}