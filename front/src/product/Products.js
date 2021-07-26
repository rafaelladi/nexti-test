import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import NewProduct from "./NewProduct";
import {BASE_PRODUCT_URL, get, del} from "../requests/requests";
import {Link} from "@material-ui/core";
import Product from "./Product";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

const Products = ({error}) => {
    const classes = useStyles();
    const [openNew, setOpenNew] = useState(false);
    const [open, setOpen] = useState(false);
    const [produtos, setProdutos] = useState([]);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    }
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    }
    const handlers = {
        handleNameChange,
        handleQuantityChange,
        handleDescriptionChange,
        handlePriceChange
    };

    const handleCloseNew = () => {
        setOpenNew(false);
    }
    const handleOpenNew = () => {
        setOpenNew(true);
    }

    const handleClose = () => {
        setOpen(false);
    }
    const handleOpen = () => {
        setOpen(true);
    }

    const getProduto = (event, id) => {
        event.preventDefault();
        const response = get(BASE_PRODUCT_URL + id, null);
        response.then(res => {
            const produto = res.data;
            setId(produto.id);
            setName(produto.name);
            setPrice(produto.price);
            setQuantity(produto.quantity);
            setDescription(produto.description);
            handleOpen();
        }, err => {
            console.log(err);
        });
    }

    const getProdutos = () => {
        const response = get(BASE_PRODUCT_URL, null);
        response.then(res => {
            const isContent = !!res?.data?.content[0].id;
            setProdutos(!!res.data && !!res.data.content && isContent ? res.data.content : []);
        }, err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getProdutos();
    }, []);

    return (
        <React.Fragment>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Preço</TableCell>
                        <TableCell>Quantidade</TableCell>
                        <TableCell align="right"/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {produtos.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.id}</TableCell>
                            <TableCell><Link onClick={e => getProduto(e, p.id)}>{p.name}</Link></TableCell>
                            <TableCell>{p.price}</TableCell>
                            <TableCell>{p.quantity}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => {
                                    const response = del(BASE_PRODUCT_URL + p.id);
                                    response.then(() => {
                                        getProdutos();
                                    }, () => {
                                        error('Não é possível apagar esse produto!');
                                    });
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.seeMore} />
            <Fab className={classes.fab} color="primary" onClick={handleOpenNew}>
                <AddIcon />
            </Fab>
            <NewProduct open={openNew} handleClose={handleCloseNew} getProducts={() => getProdutos()} />
            <Product open={open} handleClose={handleClose} getProducts={() => getProdutos()} id={id}
            name={name} price={price} quantity={quantity} description={description} {...handlers} />
        </React.Fragment>
    );
}

export default Products;