import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Chip,
    CircularProgress,
} from "@nextui-org/react";

// Define las props del componente
interface SprintProgressCardProps {
    sprint?: {
        startDate?: string; // Fecha de inicio del sprint
        endDate?: string;   // Fecha de fin del sprint
    };
}

// Simulación del cálculo de progreso (espera 3 segundos y retorna un valor fijo)
const calcularAvance = (): Promise<number> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const progreso = 75; // Valor de progreso final simulado
            resolve(progreso);
        }, 3000); // Simula un cálculo que tarda 3 segundos
    });
};

const SprintProgressCard: React.FC<SprintProgressCardProps> = ({ sprint }) => {
    const [avance, setAvance] = useState<number | null>(null); // Estado para el progreso (null = sin calcular)
    const [girando, setGirando] = useState(true); // Estado para animar el giro

    useEffect(() => {
        // Calcula el progreso después de un tiempo simulado
        calcularAvance().then((progreso) => {
            setAvance(progreso); // Establece el progreso calculado
            setGirando(false);  // Detiene el giro
        });
    }, []);

    return (
        <Card className="w-[25%] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <CardBody className="justify-center items-center pb-0">
                <CircularProgress
                    classNames={{
                        svg: `w-36 h-36 drop-shadow-md ${girando ? "animate-spin" : "" // Aplica animación solo mientras está girando
                            }`,
                        indicator: "stroke-white",
                        track: "stroke-white/10",
                        value: "text-3xl font-semibold text-white",
                    }}
                    value={avance ?? 0} // Muestra 0 hasta que avance tenga un valor
                    strokeWidth={4}
                    showValueLabel={true}
                />
            </CardBody>
            <CardFooter className="justify-center items-center pt-0">
                <Chip
                    classNames={{
                        base: "border-1 border-white/30",
                        content: "text-white/90 text-small font-semibold",
                    }}
                    variant="bordered"
                >
                    {sprint?.startDate && sprint?.endDate
                        ? `${sprint.startDate} - ${sprint.endDate}`
                        : "Fechas no definidas"}
                </Chip>
            </CardFooter>
        </Card>
    );
};

export default SprintProgressCard;
