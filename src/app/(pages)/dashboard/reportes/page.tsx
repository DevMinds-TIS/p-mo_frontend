'use client';
import { useState } from "react";

interface Team {
    name: string;
    score: number;
    progress: string;
}

interface Member {
    name: string;
    task: string;
    score: number;
    status: string;
}

const teamsData: Team[] = [
    { name: "Equipo1", score: 45, progress: "40%" },
    { name: "Equipo2", score: 96, progress: "90%" },
];

const membersData: Record<string, Member[]> = {
    Equipo1: [
        { name: "Miembro1", task: "Historia1", score: 34, status: "Finalizado" },
        { name: "Miembro2", task: "Dibujo", score: 75, status: "En proceso" },
    ],
    Equipo2: [
        { name: "MiembroA", task: "Desarrollo", score: 90, status: "Finalizado" },
        { name: "MiembroB", task: "Pruebas", score: 85, status: "En proceso" },
    ],
};

export default function ReportesPage() {
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("");

    const sortedTeams = [...teamsData].sort((a, b) => {
        switch (sortOption) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "score-desc":
                return b.score - a.score;
            case "score-asc":
                return a.score - b.score;
            default:
                return 0;
        }
    });

    const sortedMembers = selectedTeam
        ? [...(membersData[selectedTeam] || [])].sort((a, b) => {
            switch (sortOption) {
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "score-desc":
                    return b.score - a.score;
                case "score-asc":
                    return a.score - b.score;
                default:
                    return 0;
            }
        })
        : [];

    const handleExport = () => {
        let content = `Reportes de Equipos\n\n`;
        if (!selectedTeam) {
            content += `Nombre\tNota\tEstado\n`;
            sortedTeams.forEach((team) => {
                content += `${team.name}\t${team.score}\t${team.progress}\n`;
            });
        } else {
            content += `Detalles del ${selectedTeam}\n\n`;
            content += `Miembro\tTarea\tNota\tEstado\n`;
            sortedMembers.forEach((member) => {
                content += `${member.name}\t${member.task}\t${member.score}\t${member.status}\n`;
            });
        }

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = selectedTeam ? `${selectedTeam}_report.txt` : "equipos_report.txt";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Reportes de Equipos</h1>
    
            {/* Selector de equipos y filtro de ordenación */}
            <div className="mb-4 flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                {/* Selector de equipos */}
                <div className="flex-1">
                    <label htmlFor="team-select" className="mr-2 font-semibold">Selecciona un equipo:</label>
                    <select
                        id="team-select"
                        className="border border-gray-300 p-2 rounded w-full sm:w-auto"
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        <option value="">Todos los equipos</option>
                        {teamsData.map((team) => (
                            <option key={team.name} value={team.name}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
    
                {/* Filtro de ordenación */}
                <div className="flex-1">
                    <label htmlFor="sort-select" className="mr-2 font-semibold">Ordenar por:</label>
                    <select
                        id="sort-select"
                        className="border border-gray-300 p-2 rounded w-full sm:w-auto"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Selecciona</option>
                        <option value="name-asc">Nombre (A-Z)</option>
                        <option value="score-desc">Nota (Mayor a Menor)</option>
                        <option value="score-asc">Nota (Menor a Mayor)</option>
                    </select>
                </div>
            </div>
    
            {/* Botón de exportación */}
            <button
                onClick={handleExport}
                className="mb-4 p-2 bg-[#FE7F2D] text-white rounded w-full sm:w-auto"
            >
                Exportar a TXT
            </button>
    
            {/* Tabla de equipos */}
            {!selectedTeam && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#191919] text-white">
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Nombre</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Nota</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTeams.map((team) => (
                                <tr key={team.name} className="text-center">
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{team.name}</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{team.score}</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{team.progress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    
            {/* Detalle del equipo seleccionado */}
            {selectedTeam && (
                <div className="overflow-x-auto mt-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Detalles del {selectedTeam}</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#191919] text-white">
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Miembro</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Tarea</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Nota</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMembers.map((member) => (
                                <tr key={member.name} className="text-center">
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{member.name}</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{member.task}</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{member.score}</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{member.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );    
}
