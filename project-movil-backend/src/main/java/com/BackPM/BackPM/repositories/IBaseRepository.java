package com.BackPM.BackPM.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BackPM.BackPM.models.ABaseEntity;

public interface IBaseRepository<T extends ABaseEntity, ID> extends JpaRepository<T,ID> {
}