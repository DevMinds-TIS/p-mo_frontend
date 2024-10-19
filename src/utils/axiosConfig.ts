import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api', // Asegúrate de apuntar a tu API backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
