// import { useRouter } from 'next/router';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/');
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return(
            <Spinner 
                label="Cargando..." 
                color="warning" 
                size='lg'
                className='flex justify-center w-full h-screen'
            />
        );
    }

    return <>{children}</>;
}
