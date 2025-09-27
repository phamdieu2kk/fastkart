import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([])
  const [openUpdateRole, setOpenUpdateRole] = useState(false)
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: ""
  })

  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: 'include'
    })

    const dataResponse = await fetchData.json()

    if (dataResponse.success) {
      setAllUsers(dataResponse.data)
    }

    if (dataResponse.error) {
      toast.error(dataResponse.message)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="mb-5 text-lg font-semibold text-gray-800">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 table-auto">
  <thead>
    <tr className="text-gray-900 bg-gray-100">
      <th className="px-4 py-3 font-bold text-center">No</th>
      <th className="px-4 py-3 font-bold text-center">Name</th>
      <th className="px-4 py-3 font-bold text-center">Email</th>
      <th className="px-4 py-3 font-bold text-center">Role</th>
      <th className="px-4 py-3 font-bold text-center">Created At</th>
      <th className="px-4 py-3 font-bold text-center">Action</th>
    </tr>
  </thead>

  <tbody>
    {allUser.map((el, index) => (
      <tr
        key={el._id}
        className="text-center border-b hover:bg-gray-50"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 font-medium text-gray-900">{el?.name}</td>
        <td className="px-4 py-3">{el?.email}</td>
        <td className="px-4 py-3 text-center">
  <span
    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold w-20
      ${el?.role === "ADMIN"
        ? "bg-red-100 text-red-700  border-red-300"
        : "bg-blue-100 text-blue-700  border-blue-300"
      }`}
  >
    {el?.role}
  </span>
</td>

        <td className="px-4 py-3">{moment(el?.createdAt).format("ll")}</td>
        <td className="px-4 py-3">
          <button
            className="p-2 bg-yellow-300 hover:bg-yellow-500"
            onClick={() => {
              setUpdateUserDetails(el)
              setOpenUpdateRole(true)
            }}
          >
            <MdModeEdit />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  )
}

export default AllUsers
