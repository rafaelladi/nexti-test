import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Order from "./Order";
import NewOrder from "./NewOrder";
import {BASE_PEDIDOS_URL, del, get} from "../requests/requests";
import {Link} from "@material-ui/core";
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

const Orders = ({error}) => {
    const classes = useStyles();
    const [openNew, setOpenNew] = useState(false);
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);

    const [id, setId] = useState('');
    const [client, setClient] = useState({});
    const [products, setProducts]  = useState([]);
    const [date, setDate] = useState('');
    const [total, setTotal] = useState(0.0);

    const handleClientChange = (val) => {
        setClient(val);
    }
    const handleProductsChange = (val) => {
        setProducts([...val])
    }
    const handlers = {
        handleClientChange,
        handleProductsChange
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

    const getOrder = (event, id) => {
        event.preventDefault();
        const response = get(BASE_PEDIDOS_URL + id, null);
        response.then(res => {
            const pedido = res.data;
            setId(pedido.id);
            setClient(pedido.cliente);
            const prods = [];
            pedido.produtos.forEach((p) => {
                prods[p.id] = p;
            });
            setProducts(prods);
            setDate(pedido.date);
            setTotal(pedido.total);
            handleOpen();
        }, err => {
            console.log(err);
        });
    }

    const getOrders = () => {
        const response = get(BASE_PEDIDOS_URL, null);
        response.then(res => {
            const os = !!res.data ? res.data : [];
            os.forEach((o) => {
                const date = new Date(o.date);
                const pad = (s) => { return (s < 10) ? '0' + s : s; }
                o.date = [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/');
            });
            setOrders(os);
        }, err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getOrders()
    }, []);

    return (
        <React.Fragment>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell align="right"/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((o) => (
                        <TableRow key={o.id}>
                            <TableCell><Link onClick={e => getOrder(e, o.id)}>{o.id}</Link></TableCell>
                            <TableCell>{o.date}</TableCell>
                            <TableCell>{o?.cliente?.name}</TableCell>
                            <TableCell>{o.total}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => {
                                    const response = del(BASE_PEDIDOS_URL + o.id);
                                    response.then(res => {
                                        getOrders();
                                    }, () => {
                                        error('Não é possível apagar esse pedido!');
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
            <NewOrder open={openNew} handleClose={handleCloseNew} getOrders={() => getOrders()} />
            <Order open={open} handleClose={handleClose} getOrders={() => getOrders()} id={id}
            client={client} products={products} date={date} total={total} {...handlers}/>
        </React.Fragment>
    );
}

export default Orders;