import { REACT_APP_API_URL } from '../app-constants';
import axiosClient from './axiosClient';

export const getListCasinos = async () => {
    const res = await axiosClient.get(REACT_APP_API_URL + 'api/GameList');
    return res.data;
};

export const enterCasino = async (params : object) => {
    const res = await axiosClient.get(REACT_APP_API_URL + 'quantico/GameLaucher', params);
    return res.data;
};
