package com.dietricch.nextitestback.model;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "pedido")
public class PedidoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 2)
    private Double total = 0.0;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private ClienteModel cliente;

    @OneToMany(mappedBy = "pedido", cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    private Set<ItemPedido> itensPedido;

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

    public void addToTotal(Double price) {
        if(total == null)
            total = 0.0;
        total += price;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public ClienteModel getCliente() {
        return cliente;
    }

    public void setCliente(ClienteModel cliente) {
        this.cliente = cliente;
    }

    public Set<ItemPedido> getItensPedido() {
        return itensPedido;
    }

    public void setItensPedido(Set<ItemPedido> itensPedido) {
        this.itensPedido = itensPedido;
    }

    public void addItemPedido(ProdutoModel produto, Integer quantity) {
        if(itensPedido == null)
            itensPedido = new HashSet<>();
        addToTotal(produto.getPrice() * quantity);
        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setProduto(produto);
        itemPedido.setQuantity(quantity);
        itensPedido.add(itemPedido);
        itemPedido.setPedido(this);
    }

    public void addItemPedido(ItemPedido itemPedido) {
        if(itensPedido == null)
            itensPedido = new HashSet<>();
        addToTotal(itemPedido.getProduto().getPrice() * itemPedido.getQuantity());
        itensPedido.add(itemPedido);
        itemPedido.setPedido(this);
    }
}
