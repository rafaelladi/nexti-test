package com.dietricch.nextitestback.repository;

import com.dietricch.nextitestback.model.ClienteModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(collectionResourceRel = "clientes", path = "clientes")
public interface ClienteRepository extends PagingAndSortingRepository<ClienteModel, Long> {
    @RestResource(path = "like")
    Page<ClienteModel> findByNameContaining(String name, Pageable pageable);
}
