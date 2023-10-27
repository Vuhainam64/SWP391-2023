import React from 'react'

export default function TaskDetails() {
    return (
        <div>
            <div className="mt-10 text-gray-900 text-center">
                <h1 className="font-bold font-mono text-3xl mb-10">Task's Details</h1>
                <div className=''>
                    <div className='rounded-lg border border-black grid grid-cols-3'>
                        <div className='text-2xl font-bold bg-orange-400 text-blue-500 col-span-3'>Feedback details:</div>
                        <div className='col-span-1'>
                            <img src='https://th.bing.com/th/id/OIP.rfDPgPBVB8ICyUmDFqG50QHaF2?pid=ImgDet&rs=1' className='w-fit h-full object-cover' alt='Feedback' />
                        </div>
                        <div className='col-span-2'>
                            <div className='grid grid-cols-6 p-5 hover:bg-green-300'>
                                <div className='col-span-2 font-semibold'>Title:</div>
                                <div className='col-span-4 text-left'>Broken chair</div>
                            </div><hr />
                            <div className='grid grid-cols-6 p-5 hover:bg-blue-300'>
                                <div className='col-span-2 font-semibold'>Received on:</div>
                                <div className='col-span-4 text-left'>27/10/2023</div>
                            </div><hr />
                            <div className='grid grid-cols-6 p-5 hover:bg-green-300'>
                                <div className='col-span-2 font-semibold'>Description:</div>
                                <div className='col-span-4 text-left'>There is a chair which is damaged in its right leg, please come and fix it</div>
                            </div><hr />
                            <div className='grid grid-cols-6 p-5 hover:bg-blue-300'>
                                <div className='col-span-2 font-semibold'>Location:</div>
                                <div className='col-span-4 text-left'>Room 606, NVHSV campus</div>
                            </div><hr />
                            <div className='grid grid-cols-6 p-5 hover:bg-green-300'>
                                <div className='col-span-2 font-semibold'>Current status:</div>
                                <div className='col-span-4 text-left'>Pending for process</div>
                            </div><hr />
                            <div className='grid grid-cols-6 p-5 hover:bg-blue-300'>
                                <div className='col-span-2 font-semibold'>Admin notes (if any):</div>
                                <div className='col-span-4 text-left'>None</div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-10 bg-green-300 rounded-full border border-black'>
                        Task delivery:
                        <div className='font-bold text-xl'> Admin has assigned to you for checking/fixing</div>
                        <div className='font-semibold text-lg'>on 28/10/2023</div>
                    </div>
                    <div className='mt-10'>
                        <div className='grid grid-cols-3'>
                            <div className='col-span-3 font-bold text-3xl'>
                                Your commitment:
                            </div>
                            <button className='rounded-full p-2 m-2 bg-blue-400'>I have checked and fixed it</button>
                            <button className='rounded-full p-2 m-2 bg-red-400'>I have checked but couldn't fix it</button>
                            <button className='rounded-full p-2 m-2 bg-purple-400'>I have checked and there is nothing to be fixed</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
