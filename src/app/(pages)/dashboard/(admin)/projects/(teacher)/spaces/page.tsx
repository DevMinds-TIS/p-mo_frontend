'use client';
import NewSpace from "./NewSpace";

export default function SpacePage(){

    return(
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Espacios</h1>
                <NewSpace/>
            </section>
            <section>
                Hola mundo
            </section>
        </section>
    );
}