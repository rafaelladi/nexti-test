import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import {BASE_CLIENTES_URL, BASE_PEDIDOS_URL, BASE_PRODUCT_URL, get, post} from "../requests/requests";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    input: {
        width: 42,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const NewOrder = ({open, handleClose, getOrders}) => {
    const classes = useStyles();
    const [client, setClient] = useState(null);
    const [products, setProducts] = useState([]);
    const [productList, setProductList] = useState([]);
    const [clients, setClients] = useState([]);

    const getProdutos = () => {
        const response = get(BASE_PRODUCT_URL, null);
        response.then(res => {
            setProductList(!!res.data && !!res.data.content ? res.data.content : []);
        }, err => {
            console.log(err);
        });
    }

    const getClientes = () => {
        const response = get(BASE_CLIENTES_URL, null);
        response.then(res => {
            setClients(!!res.data && !!res.data.content ? res.data.content : []);
        }, err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getProdutos();
        getClientes();
    }, []);

    const handleSliderChange = (event, newValue, i) => {
        products[i].qt = newValue;
        setProducts([...products]);
    };

    const handleInputChange = (event, i) => {
        products[i].qt = event.target.value === '' ? '' : Number(event.target.value);
        setProducts([...products]);
    };

    const handleBlur = (i) => {
        if(products[i].qt < 1) {
            products[i].qt = 1;
            setProducts([...products]);
        } else if(products[i].qt > products[i].max) {
            products[i].qt = products[i].max;
            setProducts([...products]);
        }
    };

    const handleSave = () => {
        const json = {
            cliente: client.id,
            produtos: products.filter((p) => !!p)
        };
        const response = post(json, BASE_PEDIDOS_URL);
        response.then(() => {
            getOrders();
        }, err => {
            console.log(err);
        });
        handleClose();
    }

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Pedido
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleSave}>
                        Salvar
                    </Button>
                </Toolbar>
            </AppBar>
            <div style={{width: '80%', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 10}}>
                <form className={classes.form}>
                    <Autocomplete
                        id="clients-combo-box"
                        value={client}
                        onChange={(event, newValue) => {
                            setClient(newValue);
                        }}
                        options={clients}
                        getOptionLabel={(product) => product.name}
                        renderInput={(params) => <TextField {...params} label="Cliente" fullWidth/>}
                    />
                    <Autocomplete
                        id="products-combo-box"
                        onChange={(event, newValue) => {
                            if(!!newValue) {
                                const np = {
                                    id: newValue.id,
                                    name: newValue.name,
                                    qt: 1,
                                    max: newValue.quantity,
                                }
                                products[np.id] = np;
                                setProducts([...products]);
                            }
                        }}
                        options={productList}
                        getOptionLabel={(product) => product.name}
                        renderInput={(params) => <TextField {...params} label="Adicionar produto" fullWidth/>}
                    />
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell align="right" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.filter((p) =>!!p).map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs>
                                                <Slider
                                                    value={typeof row.qt === 'number' ? row.qt : 1}
                                                    onChange={(event, newValue) => handleSliderChange(event, newValue, row.id)}
                                                    aria-labelledby="input-slider"
                                                    min={1}
                                                    max={row.max}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Input
                                                    className={classes.input}
                                                    value={row.qt}
                                                    margin="dense"
                                                    onChange={(event) => handleInputChange(event, row.id)}
                                                    onBlur={() => handleBlur(row.id)}
                                                    inputProps={{
                                                        step: 1,
                                                        min: 1,
                                                        max: row.max,
                                                        type: 'number',
                                                        'aria-labelledby': 'input-slider',
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => {
                                            products[row.id] = null;
                                            setProducts([...products]);
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/*<TextField*/}
                    {/*    autoFocus*/}
                    {/*    id="name"*/}
                    {/*    label="Nome"*/}
                    {/*    type="text"*/}
                    {/*    fullWidth*/}
                    {/*/>*/}
                </form>
            </div>
        </Dialog>
    );
}

export default NewOrder;