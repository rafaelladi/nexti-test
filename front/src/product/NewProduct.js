import React, {useState} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from '@material-ui/core/styles';
import {BASE_PRODUCT_URL, post} from "../requests/requests";

const useStyles = makeStyles((theme) => ({
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
}));

const NewProduct = ({open, handleClose, getProducts}) => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleDesciptionChange = (e) => {
        setDescription(e.target.value);
    }
    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    }
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    }
    const handleSave = () => {
        const json = {
            name,
            description,
            price,
            quantity
        };
        const response = post(json, BASE_PRODUCT_URL);
        response.then(res => {
            getProducts();
        }, err => {
            console.log(err);
        });
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">Novo produto</DialogTitle>
            <DialogContent>
                <form className={classes.form}>
                    <TextField
                        value={name}
                        onChange={e => handleNameChange(e)}
                        autoFocus
                        id="name"
                        label="Nome"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        value={description}
                        onChange={e => handleDesciptionChange(e)}
                        id="desc"
                        label="Descrição"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        value={price}
                        onChange={e => handlePriceChange(e)}
                        id="price"
                        label="Preço"
                        type="number"
                        fullWidth
                    />
                    <TextField
                        value={quantity}
                        onChange={e => handleQuantityChange(e)}
                        id="qt"
                        label="Quantidade"
                        type="number"
                        fullWidth
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NewProduct;