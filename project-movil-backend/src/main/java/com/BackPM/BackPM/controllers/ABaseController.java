package com.BackPM.BackPM.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.BackPM.BackPM.Dto.ApiResponseDto;
import com.BackPM.BackPM.models.ABaseEntity;
import com.BackPM.BackPM.services.IService.IBaseService;

public abstract class ABaseController<T extends ABaseEntity, S extends IBaseService<T>> {
    protected S service;
    protected String entityName;
    protected ABaseController(S service, String entityName) {
        this.service = service;
        this.entityName = entityName;
    }

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<T>>> findByStateTrue() {
        try {
            return ResponseEntity.ok(new ApiResponseDto<List<T>>("Datos obtenidos", service.findByStateTrue(), true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponseDto<List<T>>(e.getMessage(), null, false));
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponseDto<T>> show(@PathVariable Long id) {
        try {
            T entity = service.findById(id);
            return ResponseEntity.ok(new ApiResponseDto<T>("Datos encontrados", entity, true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponseDto<T>(e.getMessage(), null, false));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<T>> save(@RequestBody T entity) {
        try {            
            return ResponseEntity.ok(new ApiResponseDto<T>("Datos almacenados", service.save(entity), true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponseDto<T>(e.getMessage(), null, false));
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponseDto<T>> update(@PathVariable Long id, @RequestBody T entity) {
        try {
            service.update(id, entity);
            return ResponseEntity.ok(new ApiResponseDto<T>("Datos actualizados", null, true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponseDto<T>(e.getMessage(), null, false));
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponseDto<T>> delete(@PathVariable Long id) {
        try {
            service.setStatus(id, false);
            return ResponseEntity.ok(new ApiResponseDto<T>("Eliminado lógicamente", null, true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponseDto<T>(e.getMessage(), null, false));
        }
    }
}