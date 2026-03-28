import od from "@/app/images/onduty-icon.png"
import Image from "next/image"

const page = () => {
  return (
    <div className='flex items-center justify-center p-5 text-center h-screen font-semibold'>
      <Image src={od} width={100} alt="Onduty Logo"/>
    </div>
  )
}

export default page
