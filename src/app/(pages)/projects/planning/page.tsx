


"use client";

import Evaluacion from "@/app/(pages)/projects/planning/details/detalle/page";
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Card,
    CardBody,
    CardFooter,
    Chip,
    CircularProgress,
    Accordion,
    AccordionItem,
    Textarea,
    Button,
} from "@nextui-org/react";
import NewSprint from "./NewSprint";

interface Sprint {
    id: string;
    number: string;
    objective: string;
    startDate: string;
    endDate: string;
    progress: number | string;
}

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
};

type User = {
    ID_Usuario: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
    Roles?: Role[];
    ID_Docente?: number;
};

export default function PlanningPage() {
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [historiasCompletadas, setHistoriasCompletadas] = useState<number>(0);
    const [hu, sethu] = useState<number>(0);
    const [canthu, setCanthu] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);

    const onDataSend = (cantidad: number) => {
        console.log("Cantidad recibida del hijo:", cantidad);
        setCanthu(cantidad);
    };

    const recibirNumero = (numero: number) => {
        console.log("Número recibido en el padre:", numero);
    };

    const calcularAvance = (historiasCompletadas: number, historiasTotales: number) => {
        if (!historiasTotales || historiasTotales <= 0) {
            return 0;
        }
        const progreso = (historiasCompletadas / historiasTotales) * 100;
        return Math.min(Math.max(progreso, 0), 100);
    };

    useEffect(() => {
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                setUser(userData); // Store the complete user object
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        } else {
            console.error("No se encontró userData en localStorage");
        }
    }, []);

    const fetchSprints = async (sprintData?: { number: string; objective: string; startDate: string; endDate: string }) => {
        if (!user?.ID_Usuario) {
            console.log("Esperando a que el usuario se cargue...");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/sprint");
            const responseHU = await axios.get("http://localhost:8000/api/historias-usuario");
            console.log(response.data);
            console.log(user.ID_Usuario);
            const filteredSprints = response.data.filter((sprint: any) => {
                return (
                    (sprint.iduser == user.ID_Usuario || sprint.iddocente == user.ID_Usuario)
                );
            });



            console.log("Sprints filtrados:", filteredSprints);
            const formattedSprints = filteredSprints.map((sprint: any) => ({
                id: sprint.idsprint.toString(),
                number: `Sprint #${sprint.numsprint}`,
                objective: sprint.goalsprint,
                startDate: sprint.startsprint.split("T")[0],
                endDate: sprint.endsprint.split("T")[0],
                progress: calcularAvance(historiasCompletadas, sprint.cantHistoriasUsuario),
            }));

            setSprints(formattedSprints);
        } catch (error) {
            console.error("Error fetching sprints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.ID_Usuario) {
            fetchSprints();
        }
    }, [user]);

    useEffect(() => {
        if (canthu !== null) {
            setProgress(calcularAvance(historiasCompletadas, canthu));
        }
    }, [canthu, historiasCompletadas]);

    const handleAccordionChange = (value: string) => {
        setSelectedSprintId(value);
        console.log("Acordeón cambiado, valor seleccionado:", value);
    };

    const renderSprintDetails = (sprint: Sprint) => {
        const sprintProgress = calcularAvance(historiasCompletadas, canthu || 0);

        return (
            <>
                <div className="p-4 flex gap-4 justify-between">
                    <Card className="border-none bg-background/60 dark:bg-default-100/50 w-[75%]" shadow="sm">
                        <CardBody>
                            <Textarea
                                isDisabled
                                size="lg"
                                labelPlacement="outside"
                                label="Objetivo"
                                defaultValue={sprint?.objective || "Sin objetivo definido"}
                            />
                        </CardBody>
                    </Card>


                </div>
            </>
        );
    };

    return (
        <section>
            <section className="flex w-full h-10 justify-between items-center p-4">
                <h1 className="text-3xl">Sprints</h1>
                <NewSprint onCreateSprint={fetchSprints} />
            </section>
            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <p>Loading sprints...</p>
                </div>
            ) : sprints.length === 0 ? (
                <div className="flex justify-center items-center h-20">
                    <p>No hay sprints registrados aún.</p>
                </div>
            ) : (
                <Accordion
                    variant="splitted"
                    onChange={handleAccordionChange}
                    value={selectedSprintId || ""}
                >
                    {sprints.map((sprint) => (
                        <AccordionItem
                            key={sprint.id}
                            title={sprint.number}
                            subtitle={`${sprint.startDate} - ${sprint.endDate}`}
                            value={sprint.id}
                        >
                            {renderSprintDetails(sprint)}
                            <Evaluacion
                                id={sprint.number}
                                sprintNumber={sprint.id}
                                onDataSend={recibirNumero}
                                iduser={user?.ID_Usuario}
                            />
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </section>
    );
}




// "use client";

// //import Evaluacion from "@/app/(pages)/dashboard/(student)/planning/details/detalle/page";

// import Evaluacion from "@/app/(pages)/projects/planning/details/detalle/page";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//     Card,
//     CardBody,
//     CardFooter,
//     Chip,
//     CircularProgress,
//     Accordion,
//     AccordionItem,
//     Textarea,
//     Button,
// } from "@nextui-org/react";
// import NewSprint from "./NewSprint";

// interface Sprint {
//     id: string;
//     number: string;
//     objective: string;
//     startDate: string;
//     endDate: string;
//     progress: number | string;
// }

// type Role = {
//     ID_Rol: number;
//     Nombre_Rol: string;
// };

// type User = {
//     ID_Usuario: number;
//     Nombre: string;
//     Apellido: string;
//     Correo: string;
//     Perfil?: string;
//     Roles?: Role[];
// };

// export default function PlanningPage() {
//     const [sprints, setSprints] = useState<Sprint[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
//     const [user, setUser] = useState<User | null>(null);
//     const [historiasCompletadas, setHistoriasCompletadas] = useState<number>(0);
//     const [hu, sethu] = useState<number>(0);
//     const [canthu, setCanthu] = useState<number>(0);
//     const [progress, setProgress] = useState<number>(0);
//     const [isWaiting, setIsWaiting] = useState<boolean>(true);
//     const [datoRecibido, setDatoRecibido] = useState<number | null>(null);
//     const [numeroHijo, setNumeroHijo] = useState(null);

//     useEffect(() => {
//         if (canthu !== 0 && canthu !== "") {
//             fetchSprints(canthu);  // Llamamos a `fetchSprints` con el valor actualizado de `canthu`
//         }
//     }, [canthu]); // Ejecuta este `useEffect` cada vez que `canthu` cambie


//     const onDataSend = (cantidad: number) => {
//         console.log("Cantidad recibida del hijo:", cantidad);
//         setCanthu(cantidad);  // Actualiza el valor de canthu
//         setIsWaiting(false);   // Ya no estamos esperando
//     };

//     const recibirNumero = (numero) => {
//         console.log("Número recibido en el padre:", numero);
//         // Aquí puedes realizar lo que necesites con el número recibido
//     };

//     const calcularAvance = (historiasCompletadas: number, historiasTotales: number) => {
//         console.log("numbase:", historiasCompletadas, "numtotal: ", historiasTotales);
//         if (!historiasTotales || historiasTotales <= 0) {
//             return 0;
//         }
//         const progreso = (historiasCompletadas / historiasTotales) * 100;
//         return Math.min(Math.max(progreso, 0), 100);
//     };




//     useEffect(() => {
//         const storedUserData = localStorage.getItem("user");
//         if (storedUserData) {
//             const userData = JSON.parse(storedUserData);
//             const userToStore: User = {
//                 ID_Usuario: userData.ID_Usuario,
//                 Nombre: userData.Nombre,
//                 Apellido: userData.Apellido,
//                 Correo: userData.Correo,
//                 Perfil: userData.Perfil,
//             };
//             setUser(userToStore);
//         } else {
//             console.error("No se encontró userData en sessionStorage");
//         }
//     }, []);

//     const fetchSprints = async (canthu: number) => {
//         if (!user) {
//             console.log("Esperando a que el usuario se cargue...");
//             return;
//         }
//         setLoading(true);
//         const iduserestudiante = user.ID_Usuario;
//         try {
//             const response = await axios.get("http://localhost:8000/api/sprint");
//             //const responseHU = await axios.get("http://localhost:8000/api/historias-usuario");

//             const filteredSprints = response.data.filter(
//                 (sprint: any) => sprint.iduser === iduserestudiante || sprint.iddocente === iduserestudiante
//             );

//             console.log("Sprints filtrados:", response);
//             const formattedSprints = filteredSprints.map((sprint: any) => ({
//                 id: sprint.idsprint.toString(),
//                 number: `Sprint #${sprint.numsprint}`,
//                 objective: sprint.goalsprint,
//                 startDate: sprint.startsprint.split("T")[0],
//                 endDate: sprint.endsprint.split("T")[0],
//                 progress: canthu === 0 || canthu === "" ? sprint.progress : calcularAvance(canthu, sprint.cantHistoriasUsuario), // Solo actualiza si `canthu` tiene valor
//             }));

//             setSprints(formattedSprints);
//         } catch (error) {
//             console.error("Error fetching sprints:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSprints();
//     }, [user, canthu]);


//     const handleActualizar = (cantidad: number) => {
//         console.log('Cantidad recibida:', cantidad);
//         sethu(cantidad);
//     };

//     const handleAccordionChange = (key: string) => {
//         setSelectedSprintId(key);
//     };

//     useEffect(() => {
//         if (canthu !== null) {
//             setProgress(calcularAvance(historiasCompletadas, canthu));
//         }
//     }, [canthu, historiasCompletadas]); // Asegúrate de incluir todos los valores que afectan el progreso


//     const renderSprintDetails = (sprint: Sprint) => {
//         // Calcular el avance si `canthu` es un número válido
//         const sprintProgress = canthu ? calcularAvance(canthu,) : sprint.progress;

//         return (
//             <>
//                 <div className="p-4 flex gap-4 justify-between">
//                     <Card className="border-none bg-background/60 dark:bg-default-100/50 w-[75%]" shadow="sm">
//                         <CardBody>
//                             <Textarea
//                                 isDisabled
//                                 size="lg"
//                                 labelPlacement="outside"
//                                 label="Objetivo"
//                                 defaultValue={sprint?.objective || "Sin objetivo definido"}
//                             />
//                         </CardBody>
//                     </Card>

//                     <Card className="w-[25%] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
//                         <CardBody className="justify-center items-center pb-0">
//                             <CircularProgress
//                                 classNames={{
//                                     svg: "w-36 h-36 drop-shadow-md",
//                                     indicator: "stroke-white",
//                                     track: "stroke-white/10",
//                                     value: "text-3xl font-semibold text-white",
//                                 }}
//                                 value={sprintProgress} // Aquí se actualiza dinámicamente
//                                 strokeWidth={4}
//                                 showValueLabel={true}
//                             />
//                         </CardBody>
//                         <CardFooter className="justify-center items-center pt-0">
//                             <Chip
//                                 classNames={{
//                                     base: "border-1 border-white/30",
//                                     content: "text-white/90 text-small font-semibold",
//                                 }}
//                                 variant="bordered"
//                             >
//                                 {sprint?.startDate && sprint?.endDate
//                                     ? `${sprint.startDate} - ${sprint.endDate}`
//                                     : "Fechas no definidas"}
//                             </Chip>
//                         </CardFooter>
//                     </Card>
//                 </div>
//             </>
//         );
//     };

//     // Función para calcular el avance (esto permanece igual)



//     return (
//         <section>
//             <section className="flex w-full h-10 justify-between items-center p-4">
//                 <h1 className="text-3xl">Sprints</h1>
//                 <NewSprint onCreateSprint={fetchSprints} />
//             </section>
//             {loading ? (
//                 <div className="flex justify-center items-center h-20">
//                     <p>Loading sprints...</p>
//                 </div>
//             ) : sprints.length === 0 ? (
//                 <div className="flex justify-center items-center h-20">
//                     <p>No hay sprints registrados aún.</p>
//                 </div>
//             ) : (
//                 <Accordion
//                     variant="splitted"
//                     onChange={handleAccordionChange}
//                     value={selectedSprintId || ""}
//                 >
//                     {sprints.map((sprint) => (
//                         <AccordionItem
//                             key={sprint.id}
//                             title={sprint.number}
//                             subtitle={`${sprint.startDate} - ${sprint.endDate}`}
//                             value={sprint.id}
//                         >
//                             {renderSprintDetails(sprint)}
//                             <Evaluacion
//                                 id={sprint.number}
//                                 sprintNumber={sprint.id}
//                                 onDataSend={recibirNumero}
//                             />
//                         </AccordionItem>
//                     ))}
//                 </Accordion>
//             )}
//         </section>
//     );

// }


























































// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     Accordion,
//     AccordionItem,
//     Button,
//     Card,
//     CardBody,
//     Chip,
//     CircularProgress,
// } from "@nextui-org/react";
// import UserStoriesForm from "./details/user-stories/UserStoriesForm";
// import TasksForm from "./details/tasks/TasksForm";
// import DeliverablesForm from "./details/deliverables/DeliverablesForm";
// import SprintReportForm from "./details/reports/SprintReportForm";
// import UserStoryReportForm from "./details/reports/UserStoryReportForm";
// import TestPlanReportForm from "./details/reports/TestPlanReportForm";

// export default function PlanningPage() {
//     const [sprints, setSprints] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch sprints from backend
//     const fetchSprints = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get("http://localhost:8000/api/sprint");
//             setSprints(response.data);
//         } catch (error) {
//             console.error("Error fetching sprints:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSprints();
//     }, []);

//     // Render details for each sprint
//     const renderSprintDetails = (sprint) => (
//         <div className="flex flex-col gap-6">
//             {/* Objetivo del Sprint */}
//             <Card shadow="sm">
//                 <CardBody>
//                     <h2 className="text-xl font-semibold mb-2">Objetivo</h2>
//                     <p>{sprint.objective}</p>
//                 </CardBody>
//             </Card>

//             {/* Progreso del Sprint */}
//             <div className="flex justify-between items-center">
//                 <CircularProgress
//                     value={70}
//                     size="lg"
//                     label="Progreso"
//                     strokeWidth={5}
//                 />
//                 <Chip>{`${sprint.startDate} - ${sprint.endDate}`}</Chip>
//             </div>

//             {/* Historias de Usuario */}
//             <div>
//                 <h3 className="text-2xl font-bold mb-4">Historias de Usuario</h3>
//                 <Button color="primary" auto>
//                     + Agregar Historia de Usuario
//                 </Button>
//                 <UserStoriesForm sprintId={sprint.id} />
//             </div>

//             {/* Tareas */}
//             <div>
//                 <h3 className="text-2xl font-bold mb-4">Tareas</h3>
//                 <Button color="secondary" auto>
//                     + Agregar Tarea
//                 </Button>
//                 <TasksForm sprintId={sprint.id} />
//             </div>

//             {/* Entregables */}
//             <div>
//                 <h3 className="text-2xl font-bold mb-4">Entregables</h3>
//                 <Button color="success" auto>
//                     + Agregar Entregable
//                 </Button>
//                 <DeliverablesForm sprintId={sprint.id} />
//             </div>

//             {/* Informes */}
//             <div>
//                 <h3 className="text-2xl font-bold mb-4">Informes</h3>
//                 <SprintReportForm sprintId={sprint.id} />
//                 <UserStoryReportForm sprintId={sprint.id} />
//                 <TestPlanReportForm sprintId={sprint.id} />
//             </div>
//         </div>
//     );

//     return (
//         <section className="container mx-auto p-6">
//             {loading ? (
//                 <p>Cargando sprints...</p>
//             ) : (
//                 <Accordion>
//                     {sprints.map((sprint) => (
//                         <AccordionItem
//                             key={sprint.id}
//                             title={`Sprint #${sprint.number}`}
//                             subtitle={`${sprint.startDate} - ${sprint.endDate}`}
//                         >
//                             {renderSprintDetails(sprint)}
//                         </AccordionItem>
//                     ))}
//                 </Accordion>
//             )}
//         </section>
//     );
// }
