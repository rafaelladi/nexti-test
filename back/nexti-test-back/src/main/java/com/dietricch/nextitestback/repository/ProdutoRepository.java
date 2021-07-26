package com.dietricch.nextitestback.repository;

import com.dietricch.nextitestback.model.ProdutoModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(collectionResourceRel = "produtos", path = "produtos")
public interface ProdutoRepository extends PagingAndSortingRepository<ProdutoModel, Long> {
    @RestResource(path = "like")
    Page<ProdutoModel> findByNameContaining(String name, Pageable pageable);
}
