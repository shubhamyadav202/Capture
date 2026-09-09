import favicon from "../assets/favicon.svg";
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from "./StoryDp.jsx";
import Nav from "./Nav.jsx";
import { useSelector } from "react-redux";
import Post from "./Post.jsx";
import { BiMessageRoundedDots } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Feed = () => {
  const { postData } = useSelector((state) => state.post);
  const { userData, notificationData } = useSelector((state) => state.user);
  const { storyList, currentUserStory } = useSelector((state) => state.story);
  const { prevChatUsers } = useSelector((state) => state.message);
  const navigate = useNavigate();

  const totalUnreadMessages =
    prevChatUsers?.reduce((sum, u) => sum + (u.unreadCount || 0), 0) || 0;

  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden">
        <img src={favicon} alt="" className="w-[60px]" />
        <div className="flex items-center gap-[15px]">
          <div className="relative z-[100] cursor-pointer" onClick={() => navigate("/notifications")}>
            <FaRegHeart className="text-[white] w-[25px] h-[25px]" />
            {notificationData?.length > 0 &&
              notificationData.some((noti) => noti.isRead === false) && (
                <div className="w-[10px] h-[10px] bg-red-500 rounded-full absolute top-0 right-[-5px]"></div>
              )}
          </div>
          <div className="relative cursor-pointer" onClick={() => navigate("/messages")}>
            <BiMessageRoundedDots className="text-[white] w-[25px] h-[25px]" />
            {totalUnreadMessages > 0 && (
              <div className="min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold rounded-full absolute -top-1.5 -right-2 flex items-center justify-center animate-pulse shadow-md shadow-pink-500/40">
                {totalUnreadMessages > 9 ? "9+" : totalUnreadMessages}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full overflow-auto gap-[10px] items-center p-[20px]">
        <StoryDp
          username={"Your Story"}
          profileImage={userData.profileImage}
          story={currentUserStory}
        />

        {storyList?.map((story, index) => (
          <StoryDp
            username={story.author.username}
            profileImage={story.author.profileImage}
            story={story}
            key={index}
          />
        ))}
      </div>

      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
        <Nav />

        {!postData ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <ClipLoader size={35} color="black" />
            <span className="text-gray-500 text-sm font-medium">Loading feed...</span>
          </div>
        ) : postData.length === 0 ? (
          <div className="text-gray-400 py-20 text-center font-medium">No posts yet</div>
        ) : (
          postData.map((post, index) => (
            <Post post={post} key={post._id || index} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
