package com.dietricch.nextitestback.repository;

import com.dietricch.nextitestback.model.PedidoModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(collectionResourceRel = "pedidos", path = "pedidos")
public interface PedidoRepository extends PagingAndSortingRepository<PedidoModel, Long> {
    @RestResource(path = "cliente")
    Page<PedidoModel> findByClienteId(Long id, Pageable pageable);
}
