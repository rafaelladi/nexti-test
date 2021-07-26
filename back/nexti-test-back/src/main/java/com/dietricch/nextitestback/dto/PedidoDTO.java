package com.dietricch.nextitestback.dto;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

public class PedidoDTO {
    @NotNull
    private Long cliente;

    @NotNull
    @NotEmpty
    private Set<ProdutoDTO> produtos;

    public Long getCliente() {
        return cliente;
    }

    public void setCliente(Long cliente) {
        this.cliente = cliente;
    }

    public Set<ProdutoDTO> getProdutos() {
        return produtos;
    }

    public void setProdutos(Set<ProdutoDTO> produtos) {
        this.produtos = produtos;
    }
}
