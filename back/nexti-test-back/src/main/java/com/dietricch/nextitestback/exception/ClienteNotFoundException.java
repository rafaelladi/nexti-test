package com.dietricch.nextitestback.exception;

public class ClienteNotFoundException extends Exception {
    public ClienteNotFoundException(String message) {
        super(message);
    }

    public ClienteNotFoundException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
