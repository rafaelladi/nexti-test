package com.dietricch.nextitestback.dto;

import com.dietricch.nextitestback.model.ClienteModel;

import java.util.Date;
import java.util.Set;

public class GetPedidoDTO {
    private ClienteModel cliente;
    private Set<ItemPedidoDTO> produtos;
    private Long id;
    private Double total;
    private Date date;

    public GetPedidoDTO(Long id, ClienteModel cliente, Double total, Date date) {
        this.cliente = cliente;
        this.id = id;
        this.total = total;
        this.date = date;
    }

    public ClienteModel getCliente() {
        return cliente;
    }

    public void setCliente(ClienteModel cliente) {
        this.cliente = cliente;
    }

    public Set<ItemPedidoDTO> getProdutos() {
        return produtos;
    }

    public void setProdutos(Set<ItemPedidoDTO> produtos) {
        this.produtos = produtos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
