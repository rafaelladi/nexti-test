import React, {useState} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import InputMask from 'react-input-mask';
import { makeStyles } from '@material-ui/core/styles';
import {BASE_CLIENTES_URL, post} from "../requests/requests";

const useStyles = makeStyles((theme) => ({
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
}));

const NewClient = ({open, handleClose, getClients}) => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleCpfChange = (e) => {
        setCpf(e.target.value);
    }
    const handleDateChange = (date) => {
        setBirthdate(date);
    }

    const handleSave = () => {
        const pad = (s) => { return (s < 10) ? '0' + s : s; }
        const date = [pad(birthdate.getDate()), pad(birthdate.getMonth()+1), birthdate.getFullYear()].join('/');
        const json = {
            name,
            cpf,
            birthdate: date
        };
        const response = post(json, BASE_CLIENTES_URL);
        response.then(res => {
            getClients();
        }, err => {
            console.log(err);
        });
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">Novo cliente</DialogTitle>
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
                    <InputMask
                        mask="999.999.999-99"
                        disabled={false}
                        maskChar=" "
                        value={cpf}
                        onChange={e => handleCpfChange(e)}
                    >
                        {() => <TextField label="CPF" fullWidth/>}
                    </InputMask>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            format="dd/MM/yyyy"
                            id="birthdate"
                            label="Data de nascimento"
                            value={birthdate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
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

export default NewClient;