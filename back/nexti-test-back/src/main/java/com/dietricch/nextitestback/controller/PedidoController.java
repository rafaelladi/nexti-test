package com.dietricch.nextitestback.controller;

import com.dietricch.nextitestback.dto.GetPedidoDTO;
import com.dietricch.nextitestback.dto.ItemPedidoDTO;
import com.dietricch.nextitestback.dto.PedidoDTO;
import com.dietricch.nextitestback.dto.ProdutoDTO;
import com.dietricch.nextitestback.exception.ClienteNotFoundException;
import com.dietricch.nextitestback.exception.ProdutoInsuficienteException;
import com.dietricch.nextitestback.exception.ProdutoNotFoundException;
import com.dietricch.nextitestback.model.ClienteModel;
import com.dietricch.nextitestback.model.ItemPedido;
import com.dietricch.nextitestback.model.PedidoModel;
import com.dietricch.nextitestback.model.ProdutoModel;
import com.dietricch.nextitestback.repository.ClienteRepository;
import com.dietricch.nextitestback.repository.ItemPedidoRepository;
import com.dietricch.nextitestback.repository.PedidoRepository;
import com.dietricch.nextitestback.repository.ProdutoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.*;

@RepositoryRestController
@RequestMapping("/pedidos")
public class PedidoController {
    private static final Logger LOG = LoggerFactory.getLogger(PedidoController.class);

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;
    private final ItemPedidoRepository itemPedidoRepository;

    @Autowired
    public PedidoController(PedidoRepository pedidoRepository,
                            ProdutoRepository produtoRepository,
                            ClienteRepository clienteRepository,
                            ItemPedidoRepository itemPedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
        this.itemPedidoRepository = itemPedidoRepository;
    }

    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(pedidoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        Optional<PedidoModel> pedidoModelOptional = pedidoRepository.findById(id);
        if(pedidoModelOptional.isPresent()) {
            PedidoModel pedido = pedidoModelOptional.get();
            GetPedidoDTO dto = new GetPedidoDTO(pedido.getId(),
                    pedido.getCliente(),
                    pedido.getTotal(),
                    pedido.getDate());
            Set<ItemPedidoDTO> produtos = new HashSet<>();
            for(ItemPedido item : pedido.getItensPedido()) {
                ItemPedidoDTO itemDto = new ItemPedidoDTO(
                        item.getProduto().getId(),
                        item.getProduto().getName(),
                        item.getQuantity(),
                        item.getProduto().getQuantity() + item.getQuantity());
                produtos.add(itemDto);
            }
            dto.setProdutos(produtos);
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> save(@RequestBody @Valid PedidoDTO dto) {
        LOG.info("saving new pedido");
        PedidoModel pedido = new PedidoModel();
        try {
            pedido.setDate(new Date());
            if(dto.getCliente() != null) {
                ClienteModel cliente = clienteRepository.findById(dto.getCliente()).orElseThrow(() ->
                        new ClienteNotFoundException("Cliente não encontrado para id: " + dto.getCliente()));
                pedido.setCliente(cliente);
            }
            if(dto.getProdutos() != null && !dto.getProdutos().isEmpty())
                updateProducts(dto.getProdutos(), pedido);
        } catch (ProdutoNotFoundException | ProdutoInsuficienteException| ClienteNotFoundException e) {
            LOG.error(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        pedido = pedidoRepository.save(pedido);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedido);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> update(@RequestBody @Valid PedidoDTO dto,
                                    @PathVariable Long id) {
        LOG.info("updating pedido " + id);

        Optional<PedidoModel> optionalPedido = pedidoRepository.findById(id);
        if(optionalPedido.isEmpty())
            return ResponseEntity.notFound().build();
        PedidoModel pedido = optionalPedido.get();

        if(dto.getCliente() != null) {
            Optional<ClienteModel> optionalCliente = clienteRepository.findById(dto.getCliente());
            if(optionalCliente.isEmpty())
                return ResponseEntity.notFound().build();
            ClienteModel cliente = optionalCliente.get();
            pedido.setCliente(cliente);
        } else {
            pedido.setCliente(null);
        }

        try {
            refreshPedido(dto.getProdutos(), pedido);
        } catch(ProdutoInsuficienteException | ProdutoNotFoundException e) {
            LOG.error(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {
        LOG.info("Deleting pedido " + id);

        Optional<PedidoModel> optionalPedido = pedidoRepository.findById(id);
        if(optionalPedido.isEmpty())
            return ResponseEntity.notFound().build();
        PedidoModel pedido = optionalPedido.get();

        for(ItemPedido item : pedido.getItensPedido()) {
            ProdutoModel produto = item.getProduto();
            produto.setQuantity(produto.getQuantity() + item.getQuantity());
            produtoRepository.save(produto);
        }
        pedidoRepository.delete(pedido);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/produto")
    @Transactional
    public ResponseEntity<?> update(@RequestBody ProdutoDTO produto,
                                    @PathVariable Long id) {
        Optional<PedidoModel> optional = pedidoRepository.findById(id);
        if(optional.isEmpty())
            return ResponseEntity.notFound().build();
        PedidoModel pedido = optional.get();
        try {
            updateProduct(produto, pedido);
        } catch(ProdutoInsuficienteException | ProdutoNotFoundException e) {
            LOG.error(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        pedido = pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }

    @DeleteMapping("/{id}/produto/{produtoId}")
    @Transactional
    public ResponseEntity<?> deleteProduto(@PathVariable Long id,
                                           @PathVariable Long produtoId) {
        Optional<PedidoModel> optionalPedido = pedidoRepository.findById(id);
        if(optionalPedido.isEmpty())
            return ResponseEntity.notFound().build();
        PedidoModel pedido = optionalPedido.get();

        Optional<ItemPedido> optionalItemPedido = itemPedidoRepository.findById(produtoId);
        if(optionalItemPedido.isEmpty())
            return ResponseEntity.notFound().build();

        ItemPedido itemPedido = optionalItemPedido.get();
        ProdutoModel produto = itemPedido.getProduto();
        produto.setQuantity(produto.getQuantity() + itemPedido.getQuantity());
        produtoRepository.save(produto);

        itemPedidoRepository.delete(itemPedido);
        pedido = pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("/{id}/cliente/{clienteId}")
    @Transactional
    public ResponseEntity<?> updateCliente(@PathVariable Long id,
                                           @PathVariable Long clienteId) {
        Optional<PedidoModel> optional = pedidoRepository.findById(id);
        if(optional.isEmpty())
            return ResponseEntity.notFound().build();
        PedidoModel pedido = optional.get();

        Optional<ClienteModel> optionalCliente = clienteRepository.findById(clienteId);
        if(optionalCliente.isEmpty())
            return ResponseEntity.notFound().build();
        ClienteModel cliente = optionalCliente.get();
        pedido.setCliente(cliente);
        pedido = pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }

    @DeleteMapping("/{id}/cliente")
    @Transactional
    public ResponseEntity<?> deleteCliente(@PathVariable Long id) {
        Optional<PedidoModel> optionalPedido = pedidoRepository.findById(id);
        if(optionalPedido.isEmpty())
            return ResponseEntity.notFound().build();
        PedidoModel pedido = optionalPedido.get();

        pedido.setCliente(null);
        pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }

    private void updateProduct(ProdutoDTO dto, PedidoModel pedido) throws ProdutoNotFoundException, ProdutoInsuficienteException {
        ProdutoModel produto = produtoRepository.findById(dto.getId()).orElseThrow(() ->
                new ProdutoNotFoundException("Produto com id: " + dto.getId() + " não encontrado"));
        if(produto.getQuantity() < dto.getQt())
            throw new ProdutoInsuficienteException("Quantidade de produtos maior do que a disponível");
        produto.setQuantity(produto.getQuantity() - dto.getQt());
        produtoRepository.save(produto);
        pedido.addItemPedido(produto, dto.getQt());
    }

    private void updateProducts(Set<ProdutoDTO> dtos, PedidoModel pedido) throws ProdutoNotFoundException, ProdutoInsuficienteException {
        for(ProdutoDTO dto : dtos) {
            updateProduct(dto, pedido);
        }
    }

    private void refreshPedido(Set<ProdutoDTO> dtos, PedidoModel pedido) throws ProdutoInsuficienteException, ProdutoNotFoundException {
        Set<ItemPedido> remove = new HashSet<>();
        for(ItemPedido item : pedido.getItensPedido()) {
            Optional<ProdutoDTO> optionalDTO = dtos.stream().
                    filter(d -> d.getId().equals(item.getProduto().getId())).findFirst();
            if(optionalDTO.isPresent()) {
                ProdutoDTO dto = optionalDTO.get();
                ProdutoModel produto = item.getProduto();
                final int diff = dto.getQt() - item.getQuantity();
                final int newQt = produto.getQuantity() - diff;
                if(newQt < 0)
                    throw new ProdutoInsuficienteException("Quantidade de produtos maior do que a disponível");
                item.setQuantity(dto.getQt());
                produto.setQuantity(newQt);
                itemPedidoRepository.save(item);
                produtoRepository.save(produto);
                dtos.remove(dto);
            } else {
                ProdutoModel produto = item.getProduto();
                produto.setQuantity(produto.getQuantity() + item.getQuantity());
                remove.add(item);
                itemPedidoRepository.delete(item);
                produtoRepository.save(produto);
            }
        }
        pedido.getItensPedido().removeAll(remove);
        for(ProdutoDTO dto : dtos) {
            ProdutoModel produto = produtoRepository.findById(dto.getId()).orElseThrow(() ->
                    new ProdutoNotFoundException("Produto com id: " + dto.getId() + " não encontrado"));
            if(produto.getQuantity() < dto.getQt())
                throw new ProdutoInsuficienteException("Quantidade de produtos maior do que a disponível");
            produto.setQuantity(produto.getQuantity() - dto.getQt());
            produto = produtoRepository.save(produto);
            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setProduto(produto);
            itemPedido.setQuantity(dto.getQt());
            itemPedido = itemPedidoRepository.save(itemPedido);
            pedido.addItemPedido(itemPedido);
            pedido = pedidoRepository.save(pedido);
        }
        double total = pedido.getItensPedido().stream().mapToDouble(i -> i.getProduto().getPrice() * i.getQuantity()).sum();
        pedido.setTotal(total);
        pedidoRepository.save(pedido);
    }
}
