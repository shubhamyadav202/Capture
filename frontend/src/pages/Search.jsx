import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setSearchData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";
import dp from "../assets/dp.jpg";

const Search = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [searchData, setLocalSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!input || !input.trim()) {
      setLocalSearchData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?keyword=${input.trim()}`,
        { withCredentials: true },
      );
      dispatch(setSearchData(result.data));
      setLocalSearchData(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  return (
    <div className="w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Search</h1>
      </div>

      <div className="w-full h-[80px] flex items-center justify-center mt-[80px]">
        <div className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px] border border-gray-800">
          <FiSearch className="w-[25px] h-[25px] text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full h-full outline-0 rounded-full px-[15px] text-white text-[17px] bg-transparent"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          {loading && <ClipLoader size={20} color="white" />}
        </div>
      </div>

      {loading && (
        <div className="py-10 flex flex-col items-center gap-3">
          <ClipLoader size={30} color="white" />
          <span className="text-gray-400 text-sm">Searching...</span>
        </div>
      )}

      {!loading && input && searchData?.length > 0 &&
        searchData.map((user) => (
          <div
            key={user._id}
            className="w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-[20px] px-[5px] cursor-pointer hover:bg-gray-200 transition-all"
            onClick={() => navigate(`/getProfile/${user.username}`)}
          >
            <div className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
              <img
                src={user.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-black text-[18px] font-semibold">
              <div>{user.username}</div>
              <div className="text-[14px] text-gray-400">{user.name}</div>
            </div>
          </div>
        ))}

      {!loading && input && searchData?.length === 0 && (
        <div className="text-gray-400 text-[16px] py-10">No users found</div>
      )}

      {!input && (
        <div className="text-[25px] text-gray-700 font-bold mt-10">
          Search Here...
        </div>
      )}
    </div>
  );
};

export default Search;
