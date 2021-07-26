package com.dietricch.nextitestback.exception;

public class ProdutoNotFoundException extends Exception {
    public ProdutoNotFoundException(String message) {
        super(message);
    }

    public ProdutoNotFoundException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
