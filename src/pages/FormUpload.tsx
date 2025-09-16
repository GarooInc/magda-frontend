import NotificationForm from "../components/NotificationForm/NotificationForm";
function FormUpload (){
    return (
        <div className='h-[100dvh] w-full bg-white p-10 flex justify-center items-center relative'>
            <img src="/assets/images/logos/logomagda.png" className="w-40 absolute top-4 left-4" alt='logo' />
            <NotificationForm />
        </div>
    )
}

export default FormUpload;