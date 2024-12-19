"use client";

import { Skeleton, Divider } from "@nextui-org/react";

export default function ProfileSkeletons() {
    return (
        <section className="flex flex-col gap-y-8 p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-[40%] lg:w-[30%] flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <h1 className="font-bold text-lg md:text-xl">
                            Datos personales
                        </h1>
                        <Skeleton className="h-8 w-8 rounded-lg" /> {/* Placeholder for UpdateProfile button */}
                    </div>
                    <div className="flex justify-center">
                        <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mt-4 rounded-lg" /> {/* Placeholder for Name */}
                    <Skeleton className="h-4 w-1/2 rounded-lg" /> {/* Placeholder for Email */}
                    <Divider />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-10 w-full rounded-lg" /> {/* Placeholder for User component */}
                        <Divider />
                    </div>
                </div>
                <div className="flex w-full md:w-[60%] lg:w-[70%] p-4 justify-center items-center gap-2">
                    <Skeleton className="w-20 h-20 rounded-full" /> {/* Placeholder for ComingSoon02Icon */}
                    <Skeleton className="h-8 w-3/5 rounded-lg" /> {/* Placeholder for Text */}
                </div>
            </div>
        </section>
    );
}