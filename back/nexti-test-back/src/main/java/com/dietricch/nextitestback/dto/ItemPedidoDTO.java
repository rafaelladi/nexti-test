package com.dietricch.nextitestback.dto;

public class ItemPedidoDTO {
    private Long id;
    private String name;
    private Integer qt;
    private Integer max;

    public ItemPedidoDTO(Long id, String name, Integer qt, Integer max) {
        this.id = id;
        this.name = name;
        this.qt = qt;
        this.max = max;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQt() {
        return qt;
    }

    public void setQt(Integer qt) {
        this.qt = qt;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }
}
