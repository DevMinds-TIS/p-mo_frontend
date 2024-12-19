import { Skeleton } from "@nextui-org/react";

export default function ProjectsSkeletons() {
    return (
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Proyectos</h1>
                <Skeleton className="w-1/4 h-10 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
            </section>
            <section className="flex flex-wrap p-4 gap-8 justify-between">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className='flex flex-col w-fit gap-2'>
                        <Skeleton className="w-64 h-12 rounded-lg" />
                        <Skeleton className="w-64 h-64 rounded-xl" />
                    </div>
                ))}
            </section>
        </section>
    );
}