import axios from 'axios';

// Obtener el token CSRF desde la metaetiqueta


let baseURL = "http://localhost:8000";

// Crea una instancia de Axios con la configuración necesaria
const registersApi = axios.create({
    baseURL: baseURL,
    responseType: 'json',
    withCredentials: true,

});

export const getAllRegister = () => registersApi.get('api/actores');

export const getRegister = (id) => registersApi.get(`api/actores/${id}`);

export const createRegister = (data) => registersApi.post('api/actores', data);

export const updateRegister = (id, data) => registersApi.put(`api/actores/${id}`, data);

export const updatePartialRegister = (id, data) => registersApi.patch(`api/actores/${id}`, data);

export const deleteRegister = (id) => registersApi.delete(`api/actores/${id}`);

export const login = (data) => registersApi.post('api/login', data);

export const getAllRegisterProyect = () => registersApi.get('api/proyecto');


export const createRegisterProyect = (formData) => {
    return registersApi.post('api/proyecto', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getProyectID = (id) => registersApi.get(`api/proyectos/${id}`);


export const getAllRegisterEquipo = () => registersApi.get('api/equipo');
export const createRegisterEquipo = (formData) => {
    return registersApi.post('api/equipo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
// export const createRegisterEquipo = (formData) => {
//     return registersApi.post('api/equipo', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     });
// };

export const getAllRegisterEstudiantes = () => registersApi.get('api/estudiantes');
export const createRegisterEstudiantes = (data) => registersApi.post('api/estudiantes', data);

export const getAllRegisterDocentes = () => registersApi.get('api/docentes');
export const createRegisterDocentes = (data) => registersApi.post('api/docentes', data);

export const getValidationUser = (id) => registersApi.get(`api/actors/${id}`);