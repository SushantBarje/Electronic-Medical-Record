import { useState } from 'react';
import useAuth from './useAuth';
import axios from '../api/axios';

const useRefreshToken = () => {
    
    const { auth, setAuth } = useAuth();

    console.log(auth);
    const refresh = async () => {
        
        const response = await axios.post('/users/refresh', {token : auth.refreshToken}, {
            withCredentials: true,
        });

        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {...prev, accessToken: response.data.accessToken};
        });

        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;