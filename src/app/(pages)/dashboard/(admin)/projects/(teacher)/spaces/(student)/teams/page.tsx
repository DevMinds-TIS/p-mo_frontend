import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";

export default function TeamsPage() {
    return (
        <section>
            <div>
                <h1 className="text-4xl p-4">
                    Equipos
                </h1>
            </div>
            <div className="flex flex-wrap gap-4 p-4">
                <Link href={"teams/team"}>
                    <Card shadow="sm" isPressable>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt="Grupo-empresa"
                                className="w-full object-cover h-36"
                                src={"https://nextui.org/images/album-cover.png"}
                            />
                        </CardBody>
                        <CardFooter className="text-small gap-4 justify-between">
                            <b>DevMinds S.R.L.</b>
                            <p className="text-default-500">6</p>
                        </CardFooter>
                    </Card>
                </Link>
                <Card shadow="sm" isPressable>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="Grupo-empresa"
                            className="w-full object-cover h-36"
                            src={"https://nextui.org/images/album-cover.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small gap-4 justify-between">
                        <b>DevMinds S.R.L.</b>
                        <p className="text-default-500">6</p>
                    </CardFooter>
                </Card>
                <Card shadow="sm" isPressable>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="Grupo-empresa"
                            className="w-full object-cover h-36"
                            src={"https://nextui.org/images/album-cover.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small gap-4 justify-between">
                        <b>DevMinds S.R.L.</b>
                        <p className="text-default-500">6</p>
                    </CardFooter>
                </Card>
                <Card shadow="sm" isPressable>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="Grupo-empresa"
                            className="w-full object-cover h-36"
                            src={"https://nextui.org/images/album-cover.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small gap-4 justify-between">
                        <b>DevMinds S.R.L.</b>
                        <p className="text-default-500">6</p>
                    </CardFooter>
                </Card>
                <Card shadow="sm" isPressable>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="Grupo-empresa"
                            className="w-full object-cover h-36"
                            src={"https://nextui.org/images/album-cover.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small gap-4 justify-between">
                        <b>DevMinds S.R.L.</b>
                        <p className="text-default-500">6</p>
                    </CardFooter>
                </Card>
                <Card shadow="sm" isPressable>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="Grupo-empresa"
                            className="w-full object-cover h-36"
                            src={"https://nextui.org/images/album-cover.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small gap-4 justify-between">
                        <b>DevMinds S.R.L.</b>
                        <p className="text-default-500">6</p>
                    </CardFooter>
                </Card>
                <Card shadow="sm" isPressable>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="Grupo-empresa"
                            className="w-full object-cover h-36"
                            src={"https://nextui.org/images/album-cover.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small gap-4 justify-between">
                        <b>DevMinds S.R.L.</b>
                        <p className="text-default-500">6</p>
                    </CardFooter>
                </Card>
                <Card shadow="sm" isPressable>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="Grupo-empresa"
                            className="w-full object-cover h-36"
                            src={"https://nextui.org/images/album-cover.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small gap-4 justify-between">
                        <b>DevMinds S.R.L.</b>
                        <p className="text-default-500">6</p>
                    </CardFooter>
                </Card>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Autoevaluación
                </h1>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Evaluación de pares
                </h1>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Evaluaciones cruzadas
                </h1>
            </div>
        </section>
    );
}