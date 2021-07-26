import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from '@material-ui/core/styles';
import {BASE_PRODUCT_URL, put} from "../requests/requests";

const useStyles = makeStyles((theme) => ({
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
}));

const Product = ({open, handleClose, getProducts, name, price, description, quantity, id,
                     handleNameChange,
                     handleDescriptionChange,
                     handlePriceChange,
                     handleQuantityChange}) => {
    const classes = useStyles();

    const handleSave = () => {
        const json = {
            name,
            description,
            price,
            quantity
        };
        const response = put(json, BASE_PRODUCT_URL + id);
        response.then(res => {
            getProducts();
        }, err => {
            console.log(err);
        });
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">{id}</DialogTitle>
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
                        onChange={e => handleDescriptionChange(e)}
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

export default Product;