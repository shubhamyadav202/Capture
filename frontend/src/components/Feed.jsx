import React from "react";
import favicon from "../assets/favicon.svg";
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from "./StoryDp";
import Nav from "./Nav.jsx";
import { useSelector } from "react-redux";
import Post from "./Post.jsx";

const Feed = () => {
  const { postData } = useSelector((state) => state.post);
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden">
        <img src={favicon} alt="" className="w-[60px]" />
        <div>
          <FaRegHeart className="text-[white] w-[25px] h-[25px]" />
        </div>
      </div>

      <div className="flex w-full overflow-auto gap-[10px] items-center p-[20px]">
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
        <StoryDp username={"username"} />
      </div>
      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
        <Nav />

        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
