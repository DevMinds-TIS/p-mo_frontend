// "use client";

// import { BreadcrumbItem, Breadcrumbs, Link } from "@nextui-org/react";
// import { useRouter } from "next/router";

// export default function DynamicBreadcrumbs() {
//     const router = useRouter();
//     const pathnames = router.pathname.split("/").filter((x) => x);

//     return (
//         <Breadcrumbs>
//             <BreadcrumbItem href="/">Home</BreadcrumbItem>
//             {pathnames.map((value, index) => {
//                 const href = `/${pathnames.slice(0, index + 1).join("/")}`;
//                 const isLast = index === pathnames.length - 1;
//                 return isLast ? (
//                     <BreadcrumbItem key={href}>{value}</BreadcrumbItem>
//                 ) : (
//                     <BreadcrumbItem key={href} href={href}>
//                         <Link href={href}>{value}</Link>
//                     </BreadcrumbItem>
//                 );
//             })}
//         </Breadcrumbs>
//     );
// }


"use client";

import { BreadcrumbItem, Breadcrumbs, Link } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DynamicBreadcrumbs() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const pathnames = router.pathname.split("/").filter((x) => x);

    return (
        <Breadcrumbs>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            {pathnames.map((value, index) => {
                const href = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                return isLast ? (
                    <BreadcrumbItem key={href}>{value}</BreadcrumbItem>
                ) : (
                    <BreadcrumbItem key={href} href={href}>
                        <Link href={href}>{value}</Link>
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumbs>
    );
}
