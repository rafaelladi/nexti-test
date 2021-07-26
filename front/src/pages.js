import Orders from "./order/Orders";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import CategoryIcon from "@material-ui/icons/Category";
import React from "react";
import Clients from "./client/Clients";
import Products from "./product/Products";

export const pages =[
    {
        title: 'Pedidos',
        page: <Orders />,
        icon: <ShoppingCartIcon />
    },
    {
        title: 'Clientes',
        page: <Clients />,
        icon: <PeopleAltIcon />
    },
    {
        title: 'Produtos',
        page: <Products />,
        icon: <CategoryIcon />
    },
]