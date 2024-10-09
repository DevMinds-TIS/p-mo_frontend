// src/pages/docente/index.tsx

import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
export default function HomeDocente() {
    const router = useRouter();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user || user.role !== 'docente') {
            router.push('/unauthorized');
        }
    }, [user]);

    if (!user) return <p>Redirigiendo...</p>;

    return <h1>Bienvenido Docente</h1>;
}