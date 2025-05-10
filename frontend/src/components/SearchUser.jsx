// import { useEffect, useState } from "react";
// import { IoMdSearch } from "react-icons/io";
// import { Loader } from "./Loader";
// import UserSearchCard from "./UserSearchCard";
// import toast from "react-hot-toast";
// import axios from "axios";
// const SearchUser = () => {
//   const [searchUser, setSearchUser] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const handleSearchUser = async () => {
//     const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search`;
//     try {
//       setLoading(true);
//       const response = await axios.post(URL, {
//         search: search,
//       });
//       setLoading(false);
//       setSearchUser(response.data.data);
//     } catch (error) {
//       toast.error(error.response?.data?.message);
//     }
//   };
//   useEffect(() => {
//     handleSearchUser();
//   }, [search]);
//   console.log("searchUser", searchUser);
//   return (
//     <div className="fixed top-0 left-0 right-0  bg-slate-700 opacity-80 h-screen p-2 ">
//       <div className="w-full max-w-lg mx-auto mt-12 ">
//         <div className="bg-white rounded h-14 flex overflow-hidden">
//           <input
//             type="text"
//             placeholder="search user by name, email...."
//             onChange={(e) => setSearch(e.target.value)}
//             value={search}
//             className="w-full outline-none py-1 h-full  px-4"
//           />
//           <div className="h-14 w-14 flex justify-cneter items-center font-bold ">
//             {" "}
//             <IoMdSearch size={25} />
//           </div>
//         </div>
//         <div className="bg-white mt-2 w-full p-4 rounded overflow-y-auto">
//           {searchUser.length === 0 && !loading && (
//             <p className="text-slate-500 text-center">No User Found</p>
//           )}
//           {loading && <Loader />}
//           {searchUser.length !== 0 &&
//             !loading &&
//             searchUser.map((user, index) => {
//               return <UserSearchCard key={user._id} user={user} />;
//             })}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default SearchUser;
import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Loader } from "./Loader";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  console.log("searchUser", searchUser);

  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-700 opacity-80 h-screen p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-12">
        <div className="bg-white rounded h-14 flex overflow-hidden">
          <input
            type="text"
            placeholder="search user by name, email...."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="w-full outline-none py-1 h-full px-4"
          />
          <div className="h-14 w-14 flex justify-center items-center font-bold">
            <IoMdSearch size={25} />
          </div>
        </div>

        {/* Scrollable user list */}
        <div
          className="bg-white mt-2 w-full p-4 rounded overflow-y-auto scroll-container"
          style={{ maxHeight: "450px" }} // You can adjust this value to fit your design
        >
          {searchUser.length === 0 && !loading && (
            <p className="text-slate-500 text-center">No User Found</p>
          )}
          {loading && <Loader />}
          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>
      <div className="absolute top-0 right-0 text-lg p-2 lg:text-4xl hover:text-black">
        <button className="hover:bg-slate-200" onClick={onClose}>
          <IoClose size={25} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
