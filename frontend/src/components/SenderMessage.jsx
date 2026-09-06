import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const SenderMessage = ({ message }) => {
  const { userData } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);
  const scroll = useRef();

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.message,messages.image]);

  return (
    <div
      ref={scroll}
      className="w-fit max-w-[60%] bg-gradient-to-br from-[#9500ff] to-[#ff0095] rounded-t-2xl rounded-bl-2xl rounded-br-0 px-[10px] py-[10px] relative ml-auto right-0 flex flex-col gap-[10px]"
    >
      {message.image && (
        <img
          src={message.image}
          className="h-[200px] object-cover rounded-2xl"
          alt=""
        />
      )}

      {message.message && (
        <div className="text-[18px] text-white wrap-break-word">
          {message.message}
        </div>
      )}

      <div className="w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-25px] bottom-[-40px]">
        <img
          src={userData.profileImage}
          alt=""
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

export default SenderMessage;
