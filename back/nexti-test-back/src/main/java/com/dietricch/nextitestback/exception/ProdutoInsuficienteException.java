package com.dietricch.nextitestback.exception;

public class ProdutoInsuficienteException extends Exception {
    public ProdutoInsuficienteException(String message) {
        super(message);
    }

    public ProdutoInsuficienteException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
