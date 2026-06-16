import LoginForm from "@/components/LoginForm";


export default function LoginPage() {
    return (

        < div className = "flex min-h-screen items-center justify-center bg-white dark:bg-dark" >
            {/* < div className = "w-full max-w-md  bg-white dark:bg-light rounded-xl shadow-md" > */}

                {/* Renderizado de tu componente de formulario */ }
                < LoginForm />
                
            {/* </div> */}
        </div >
    );
}