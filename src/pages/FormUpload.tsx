import NotificationForm from "../components/NotificationForm/NotificationForm";
function FormUpload (){
    return (
        <div className='h-[100dvh] w-full bg-white md:p-10 pt-10 px-4 flex flex-col justify-start items-center relative'>
            <div className="flex justify-start items-start w-full">
                <img src="/assets/images/logos/logomagda.png" className="w-40" alt='logo' />
            </div>
            <div className="flex flex-1 justify-center items-center w-full">
                <NotificationForm />
            </div>
        </div>
    )
}

export default FormUpload;