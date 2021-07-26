package com.dietricch.nextitestback.config;

import com.dietricch.nextitestback.model.ClienteModel;
import com.dietricch.nextitestback.model.ItemPedido;
import com.dietricch.nextitestback.model.PedidoModel;
import com.dietricch.nextitestback.model.ProdutoModel;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class SpringRestConfiguration implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.setDefaultMediaType(MediaType.APPLICATION_JSON);
        config.exposeIdsFor(ProdutoModel.class, PedidoModel.class, ClienteModel.class, ItemPedido.class);
        config.useHalAsDefaultJsonMediaType(false);
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
    }
}
