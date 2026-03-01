import { AlertTriangle } from 'lucide-react'

const page = () => {
    return (
        <div className="flex flex-col md:flex-row gap-5 p-10 justify-center items-center w-full h-screen bg-(--color-bg) text-center md:text-left">
            <div className='flex items-center justify-center'>
                <AlertTriangle size={100} />
            </div>
            <div className='flex flex-col justify-center'>
                <span className="text-xl font-semibold">Access Denied.</span>
                <span className="font-medium text-(--color-gray)">Employees do not have permission to view this page.</span>
                <span className="font-medium text-(--color-gray)">Please download mobile version to get access.</span>
            </div>
        </div>
    )
}

export default page
