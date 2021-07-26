import axios from 'axios';

export const BASE_PRODUCT_URL = '/produtos/';
export const BASE_CLIENTES_URL = '/clientes/';
export const BASE_PEDIDOS_URL = '/pedidos/';

export async function post(data, url) {
    return axios({
        method: 'post',
        url,
        data
    });
}

export async function put(data, url) {
    return axios({
        method: 'put',
        url,
        data
    });
}

export async function del(url) {
    return axios({
        method: 'delete',
        url
    });
}

export async function get(url, params) {
    return axios.get(
        url,
        params
    );
}

