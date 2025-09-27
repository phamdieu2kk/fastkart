import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole, setUserRole] = useState(role)

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)
    }

    const updateUserRole = async () => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                role: userRole
            })
        })

        const responseData = await fetchResponse.json()

        if (responseData.success) {
            toast.success(responseData.message)
            onClose()
            callFunc()
        } else {
            toast.error(responseData.message || "Update failed")
        }
    }

    // helper render badge màu
const roleBadge = (role) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-700 border border-red-300";
    case "SELLER":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    default:
      return "bg-blue-100 text-blue-700 border border-blue-300";
  }
};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-sm p-6 bg-white shadow-lg rounded-2xl">
                {/* Nút đóng */}
                <button
                    className="absolute text-gray-500 top-3 right-3 hover:text-red-500"
                    onClick={onClose}
                >
                    <IoMdClose size={22} />
                </button>

                {/* Tiêu đề */}
                <h1 className="pb-4 text-lg font-semibold text-gray-800">
                    Change User Role
                </h1>

                {/* Thông tin user */}
                <div className="mb-4 space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Name:</span> {name}</p>
                    <p><span className="font-medium">Email:</span> {email}</p>
                </div>

                {/* Role */}
                <div className="flex items-center justify-between mb-6">
                    <p className="font-medium text-gray-700">
                        Current Role:{" "}
                        <span className={`px-2 py-1 text-xs rounded-md font-semibold ${roleBadge(role)}`}>
                            {role}
                        </span>
                    </p>
                </div>

                {/* Select */}

                   <div className='flex items-center justify-between my-4'>
               <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select new role
                    </label>
                <select className='px-4 py-1 border' value={userRole} onChange={handleOnChangeSelect}>
                    {
                        Object.values(ROLE).map(el => {
                            return(
                                <option value={el} key={el}>{el}</option>
                            )
                        })
                    }
                </select>
            </div>




              {/* Action buttons */}
<div className="flex justify-end gap-3 pt-4 border-t">
  <button
    className="px-4 py-2 text-sm font-medium text-gray-600 transition bg-gray-100 rounded-lg hover:bg-gray-200"
    onClick={onClose}
  >
    Cancel
  </button>
  <button
    className="px-4 py-2 text-sm font-medium text-white transition bg-yellow-400 rounded-lg hover:bg-yellow-500"
    onClick={updateUserRole}
  >
    Change Role
  </button>
</div>


            </div>
        </div>
    )
}

export default ChangeUserRole
