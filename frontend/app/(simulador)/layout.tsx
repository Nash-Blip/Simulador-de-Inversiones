import React from "react";
import AppBar from "@/components/AppBar";

interface PrivadoLayoutProps {
    children: React.ReactNode;
}

export default function PrivadoLayout({ children }: PrivadoLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-[#0b0f19] text-white overflow-hidden">

            {/* Renderizamos el AppBar directo sin un contenedor rígido intermedio.
                Él mismo se encarga de fijarse o colapsar gracias al responsive interno.
            */}
            <AppBar />

            {/* COLUMNA DERECHA: CONTENIDO DINÁMICO
                Agregamos 'md:ml-0' si fuera necesario, pero al ser 'md:static' el AppBar, 
                flexbox va a empujar el contenido automáticamente de forma limpia en escritorio.
                En móvil, al estar el AppBar como 'fixed', el contenido ocupa el 100% real.
            */}
            <main className="flex-1 min-w-0 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}