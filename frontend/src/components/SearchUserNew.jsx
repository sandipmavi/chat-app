import { useEffect, useState } from "react";

import { Loader } from "./Loader";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { Search, X } from "lucide-react";

// debounce helper
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const handleInitial = async () => {
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
    handleInitial();
  }, []);

  const debouncedSearch = useDebounce(search, 400); // wait 400ms

  const handleSearchUser = async () => {
    if (!debouncedSearch.trim()) {
      setSearchUser([]);
      return;
    }

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: debouncedSearch,
      });
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [debouncedSearch]);

  return (
    <div
      className="fixed top-14 left-14 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full  max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
        >
          <X
            className="absolute right-3 text-gray-500 hover:text-[var(--accent)]"
            size={24}
          />
        </button>
        <div className="flex items-center border-b p-3 relative">
          <Search className="text-[var(--accent)] mr-2" size={22} />
          <input
            type="text"
            placeholder="Search user by name or email..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        
        <div className="max-h-[400px] overflow-y-auto p-3">
          {loading && (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          )}

          {!loading && searchUser.length === 0 && debouncedSearch && (
            <p className="text-center text-sm text-gray-500 py-6">
              No user found
            </p>
          )}

          {searchUser.length > 0 &&
            !loading &&
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
