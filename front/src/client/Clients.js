import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import NewClient from "./NewClient";
import {BASE_CLIENTES_URL, del, get} from "../requests/requests";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Client from "./Client";
import {Link} from "@material-ui/core";

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

const Clients = ({error}) => {
    const classes = useStyles();
    const [openNew, setOpenNew] = useState(false);
    const [open, setOpen] = useState(false);
    const [clients, setClients] = useState([]);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleCpfChange = (e) => {
        setCpf(e.target.value);
    }
    const handleBirthdateChange = (date) => {
        setBirthdate(date);
    }
    const handlers = {
        handleNameChange,
        handleCpfChange,
        handleBirthdateChange
    };

    const handleCloseNew = () => {
        setOpenNew(false);
    }
    const handleOpenNew = () => {
        setOpenNew(true);
    }

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const getCliente = (event, id) => {
        event.preventDefault();
        const response = get(BASE_CLIENTES_URL + id, null);
        response.then(res => {
            const cliente = res.data;
            setId(cliente.id);
            setName(cliente.name);
            setCpf(cliente.cpf);
            const parts = cliente.birthdate.split("/");
            setBirthdate(new Date(parts[2], parts[1] - 1, parts[0]));
            handleOpen();
        }, err => {
            console.log(err);
        });
    }

    const getClientes = () => {
        const response = get(BASE_CLIENTES_URL, null);
        let isContent = true;
        response.then(res => {
            res.data.content.forEach((c) => {
                if(!!c.birthdate) {
                    const parts = c.birthdate.split("/");
                    c.birthdate = new Date(parts[2], parts[1] - 1, parts[0]);
                } else {
                    isContent = false;
                }
            });
            setClients(!!res.data && !!res.data.content && isContent ? res.data.content : []);
        }, err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getClientes()
    }, []);

    return (
        <React.Fragment>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell align="right"/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clients.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell><Link onClick={e => getCliente(e, row.id)}>{row.name}</Link></TableCell>
                            <TableCell>{row.cpf}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => {
                                    const response = del(BASE_CLIENTES_URL + row.id);
                                    response.then(() => {
                                        getClientes();
                                    }, () => {
                                        error('Não é possível apagar esse cliente!');
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
            <NewClient open={openNew} handleClose={handleCloseNew} getClients={() => getClientes()} />
            <Client open={open} handleClose={handleClose} getClients={() => getClientes()} id={id}
            name={name} cpf={cpf} birthdate={birthdate} {...handlers} />
        </React.Fragment>
    );
}

export default Clients;