import LoginForm from "../components/LoginForm/LoginForm"

function Login (){

    return (
        <div className='md:hero h-full w-full'>
                <div className="hero-content flex flex-col-reverse lg:flex-row lg:h-full w-full p-0 max-w-full gap-0">
                    <div className='w-full lg:w-1/2'>
                        <div className="relative md:h-screen w-full text-4xl font-bold  bg-gradient-to-r from-[#200085] to-[#2f01c9]">
                            <div className="md:absolute inset-0 bg-black opacity-40 hidden md:block"></div>
                            <div className="md:absolute -right-10 top-1/2 transform -translate-y-1/2 h-full w-16 bg-white rounded-xl hidden md:block"></div>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 h-screen relative z-10'>
                        <div className='w-full md:justify-start justify-center items-center flex absolute top-2 p-2'>
                            <img src="src/assets/images/logos/logomagda.png" className="w-40" alt='logo' />
                        </div>
                        <div className='flex flex-col items-center justify-center w-full gap-4 h-full bg-white'>
                            <div className='flex flex-col items-center justify-center  gap-4 w-full'>
                                <h2 className='text-4xl font-bold bg-clip-text text-[#200085]'>Bienvenido</h2>
                            </div>
                            <LoginForm />
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Login;