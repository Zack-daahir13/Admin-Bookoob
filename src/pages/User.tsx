import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { User } from "../utils/Dbtypes";
import useSupabase from "../hooks/useSupabase";


const UserPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([
    { id: "1", username: "John Doe", email: "john@example.com", mobile_number: "1234567890", profile_image: "/assets/profile1.jpg" },
    { id: "2", username: "Jane Smith", email: "jane@example.com", mobile_number: "9876543210", profile_image: "/assets/profile2.jpg" },
    { id: "3", username: "Sam Green", email: "sam@example.com", mobile_number: "1122334455", profile_image: "/assets/profile3.jpg" },
  ]);
  const { GetUsers } = useSupabase();
  // Handle search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete user
  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  useEffect(() => {
    const getdata = async () => {
      const {res , errmsg} = await GetUsers();
      if (errmsg) {
        alert(errmsg);
      }
      if (res) {
        setUsers(res);
      }
    };
    getdata()
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Top Bar (Search + Add Button) */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-1/3"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left">UserName</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Mobile Number</th>
              <th className="py-3 px-4 text-left">Profile Image</th>
              <th className="py-3 px-4 text-center">Country</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-3 px-4 ">{user.username}</td>
                <td className="py-3 px-4 ">{user.email}</td>
                <td className="py-3 px-4 ">{user.mobile_number}</td>
                <td className="py-3 px-4 flex justify-center">
                  <img
                    src={user.profile_image}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  {user.country}
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => user.id && deleteUser(user.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;
