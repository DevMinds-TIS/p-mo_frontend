import { ThemeSwitcher } from "@/app/ThemeSwitcher";
import LogIn from "./LogIn";

export default function Landing(){
    return(
        <section>
            <div className="flex justify-center p-2">
                <ThemeSwitcher/>
            </div>
            <LogIn/>  
        </section>    
    );
}