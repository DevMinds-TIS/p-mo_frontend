// // withAuth.jsx
// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';


// const restrictedRoutes = [
//     '/calendarizacion/layout',
//     '/detalle/page',
//     '/componentes/home',
//     // Otras rutas...
// ];
// const withAuth = (WrappedComponent) => {
//     return (props) => {
//         const router = useRouter();

//         useEffect(() => {
//             const userDataString = window.sessionStorage.getItem('userData');
//             if (!userDataString) {
//                 router.push('/login'); // Redirigir a la página de inicio de sesión si no hay usuario autenticado
//             }
//         }, [router]);

//         return <WrappedComponent {...props} />;
//     };
// };

// export default withAuth;


//ROLES

// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const withAuth = (WrappedComponent, allowedRoles = []) => {
//     return (props) => {
//         const router = useRouter();

//         useEffect(() => {
//             const userDataString = window.sessionStorage.getItem('userData');
//             if (!userDataString) {
//                 router.push('/login'); // Redirigir si no hay usuario autenticado
//             } else {
//                 const userData = JSON.parse(userDataString);
//                 if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
//                     router.push('/not-authorized'); // Redirigir si el rol no está permitido
//                 }
//             }
//         }, [router]);

//         return <WrappedComponent {...props} />;
//     };
// };

// export default withAuth;


import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const userDataString = window.sessionStorage.getItem('userData');

            // Si no hay datos de usuario, redirigir a la página "No autorizado"
            if (!userDataString) {
                router.push('/not-authorized'); // Redirigir a la página de no autorizado
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;

