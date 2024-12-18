import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectedItems, SelectItem, SharedSelection, useDisclosure, User } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { useEffect, useState } from "react";

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
    Icono_Rol: string;
};

type User = {
    ID_Usuario: number;
    ID_Espacio: number;
    ID_Siscode: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
    Roles: Role[]
};

type Space = {
    ID_Espacio: number;
}

type Team = {
    ID_Equipo: number;
    ID_Espacio: number;
    ID_Usuario: number;
    Nombre_Equipo: string;
};

type TeamMember = {
    ID_Miembro_Equipo: number;
    ID_Equipo: number;
    ID_Usuario: number;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL as string;

const fetchTeamByName = async (name: string): Promise<Team | null> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/teams`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Error al obtener los equipos');

    const data = await response.json();
    const teams: Team[] = data.data;

    const team = teams.find((team) => team.Nombre_Equipo === name);
    console.log("Equipo", team);
    return team || null;
};

const fetchTeamMembers = async (teamId: number): Promise<TeamMember[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/team-member`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener los miembros del equipo');
    const data = await response.json();
    return data.data;
};

// const fetchUsersBySpaceId = async (spaceId: number): Promise<User[]> => {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No token found');
//     const response = await fetch(`${backendUrl}/siscode`, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) throw new Error('Error al obtener los usuarios');
//     const data = await response.json();
//     console.log("Espacio", data.data);

//     const users = data.data.filter((user: any) => user.ID_Espacio === spaceId && user.ID_Usuario !== null && user.ID_Usuario !== undefined);

    // const detailedUsers = await Promise.all(
    //     users.map(async (user: any) => {
    //         const userDetailsResponse = await fetch(`${backendUrl}/users/${user.ID_Usuario}`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });

    //         if (!userDetailsResponse.ok) throw new Error('Error al obtener los detalles del usuario');
    //         const userDetails = await userDetailsResponse.json();
    //         return {
    //             ...userDetails.data,
    //             ID_Siscode: user.ID_Siscode,
    //             ID_Espacio: user.ID_Espacio,
    //         };
    //     })
    // );

//     return detailedUsers;
// };

const fetchUsersBySpaceId = async (spaceId: number, teamId: number | null): Promise<User[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/siscode`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener los usuarios');
    const data = await response.json();

    const users = data.data.filter((user: User) => user.ID_Espacio === spaceId && user.ID_Usuario !== null && user.ID_Usuario !== undefined);
    console.log("UsersDataFiltered", users);

    const detailedUsers = await Promise.all(
        users.map(async (user: User) => {
            const userDetailsResponse = await fetch(`${backendUrl}/users/${user.ID_Usuario}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!userDetailsResponse.ok) throw new Error('Error al obtener los detalles del usuario');
            const userDetails = await userDetailsResponse.json();
            return {
                ...userDetails.data,
                ID_Siscode: user.ID_Siscode,
                ID_Espacio: user.ID_Espacio,
            };
        })
    );

    if (teamId !== null) {
        const teamMembers = await fetchTeamMembers(teamId);
        const memberIds = teamMembers.map(member => member.ID_Usuario);
        return detailedUsers.filter((user: { ID_Usuario: number; }) => !memberIds.includes(user.ID_Usuario));
    } else {
        return detailedUsers;
    }
};

interface NewMemberProps {
    onNewMember: (member: TeamMember) => void;
    params: { Nombre_Equipo: string };
}

export default function NewMember({ params, onNewMember }: NewMemberProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [students, setStudents] = useState<User[]>([]);
    const [teamId, setTeamId] = useState<number | null>(null);
    const [hasAvailableStudents, setHasAvailableStudents] = useState<boolean>(true);

    // useEffect(() => {
    //     const fetchTeamAndStudents = async () => {
    //         try {
    //             const fetchedTeam = await fetchTeamByName(params.Nombre_Equipo);
    //             if (fetchedTeam) {
    //                 setTeamId(fetchedTeam.ID_Equipo);
    //                 const spaceId = fetchedTeam.ID_Espacio;
    //                 const fetchedStudents = await fetchUsersBySpaceId(spaceId);
    //                 setStudents(fetchedStudents);
    //                 console.log("Estudiantes", fetchedStudents);
    //             }
    //         } catch (error) {
    //             console.error('Error al obtener los datos:', error);
    //         }
    //     };

    //     fetchTeamAndStudents();
    // }, [params.Nombre_Equipo]);

    useEffect(() => {
        const fetchTeamAndStudents = async () => {
            try {
                const fetchedTeam = await fetchTeamByName(params.Nombre_Equipo);
                if (fetchedTeam) {
                    setTeamId(fetchedTeam.ID_Equipo);
                    const spaceId = fetchedTeam.ID_Espacio;
                    const fetchedStudents = await fetchUsersBySpaceId(spaceId, fetchedTeam.ID_Equipo);
                    setStudents(fetchedStudents);
                    setHasAvailableStudents(fetchedStudents.length > 0);
                    console.log("Estudiantes", fetchedStudents);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchTeamAndStudents();
    }, [params.Nombre_Equipo]);

    const handleSelectionChange = (keys: SharedSelection) => {
        if (keys === "all") {
            setSelectedKeys(new Set<string>());
        } else {
            setSelectedKeys(new Set(keys as Set<string>));
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            if (!teamId) {
                throw new Error('Team ID not found');
            }

            const selectedUsers = Array.from(selectedKeys).map(key => Number(key));
            await Promise.all(
                selectedUsers.map(async (userId) => {
                    const teamMemberData = {
                        idteam: teamId,
                        iduser: userId,
                        namerol: "Miembro de equipo",
                    };
                    const response = await fetch(`${backendUrl}/team-member`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(teamMemberData),
                    });
                    if (!response.ok) {
                        throw new Error('Error al agregar el miembro del equipo');
                    }
                    const responseData = await response.json();
                    onNewMember(responseData.team_member);
                    console.log('Nuevo miembro del equipo agregado:', responseData);
                })
            );
            onOpenChange();
        } catch (error) {
            console.error('Error al agregar el miembro del equipo:', error);
        }
    };

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center" size="xl">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">Agregar Miembro</ModalHeader>
                            <ModalBody>
                                {hasAvailableStudents ? (
                                    <Select
                                        items={students}
                                        label="Estudiantes"
                                        placeholder="Selecciona al compañero de clase"
                                        labelPlacement="outside"
                                        classNames={{ base: "w-full", trigger: "h-14" }}
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={handleSelectionChange}
                                        renderValue={(items: SelectedItems<User>) => {
                                            console.log("Selected items data:", items);
                                            return items.map((item) => {
                                                const student = students.find(s => s.ID_Usuario?.toString() === item.key || `null-${s.ID_Siscode}` === item.key);
                                                console.log("Find", student);
                                                return student ? (
                                                    <div key={item.key} className="flex items-center gap-2">
                                                        <User
                                                            name={`${student.Nombre} ${student.Apellido}`}
                                                            description={student.Correo}
                                                            avatarProps={{
                                                                name: student.Nombre && student.Apellido ? `${student.Nombre[0]}${student.Apellido[0]}` : undefined,
                                                                src: student.Perfil ? `${storageUrl}/${student.Perfil}` : undefined,
                                                            }}
                                                        />
                                                    </div>
                                                ) : null;
                                            });
                                        }}
                                    >
                                        {students.map((student) => (
                                            <SelectItem
                                                key={student.ID_Usuario ? student.ID_Usuario.toString() : `null-${student.ID_Siscode}`}
                                                textValue={student.Nombre}
                                            >
                                                <div className="flex gap-2 items-center">
                                                    <User
                                                        name={`${student.Nombre} ${student.Apellido}`}
                                                        description={student.Correo}
                                                        avatarProps={{
                                                            name: student.Nombre && student.Apellido ? `${student.Nombre[0]}${student.Apellido[0]}` : undefined,
                                                            src: student.Perfil ? `${storageUrl}/${student.Perfil}` : undefined,
                                                        }}
                                                    />
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                ) : (
                                    <p>Todos los usuarios ya tienen un grupo-empresa.</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" className="w-full h-12 bg-[#FF9B5A] text-white text-lg font-bold">
                                    Agregar
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}