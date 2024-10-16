"use client";
//import Detalle from "@/app/(pages)/dashboard/(student)/planning/details/detalle/page";
import Evaluacion from "@/app/(pages)/dashboard/(student)/planning/details/evaluaciones/page";
//import PlanillaEva from "@/app/(pages)/dashboard/(student)/planning/details/PlanillaEvaluacion/page";

export default function DetailsPage(){
    return(
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Objetivo</h1>
            </section>
            <section className="flex flex-col">
                {/* <Detalle></Detalle> */}
                <Evaluacion></Evaluacion>
                {/*<PlanillaEva></PlanillaEva>*/}
            </section>
        </section>
    );
}