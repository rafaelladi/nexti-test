package com.dietricch.nextitestback.exception;

public class PedidoNotFoundException extends Exception {
    public PedidoNotFoundException(String message) {
        super(message);
    }

    public PedidoNotFoundException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
