import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    prevChatUsers: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    addMessage: (state, action) => {
      const newMsg = action.payload;
      if (!newMsg) return;
      const exists = state.messages.some(
        (m) => m._id && newMsg._id && m._id === newMsg._id,
      );
      if (!exists) {
        state.messages = [...state.messages, newMsg];
      }
    },
    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload;
    },
    moveChatToTop: (state, action) => {
      const { user, message, isIncoming } = action.payload || {};
      if (!user?._id) return;
      const targetId = user._id.toString();

      const existingUsers = state.prevChatUsers ? [...state.prevChatUsers] : [];
      const index = existingUsers.findIndex(
        (u) => (u._id || u)?.toString() === targetId,
      );

      let targetUser;
      if (index !== -1) {
        const existing = existingUsers[index];
        targetUser = {
          ...existing,
          ...user,
          username:
            user.username && user.username !== "Someone"
              ? user.username
              : existing.username && existing.username !== "Someone"
              ? existing.username
              : user.name || "",
          profileImage: user.profileImage || existing.profileImage,
        };
        existingUsers.splice(index, 1);
      } else {
        targetUser = { ...user, unreadCount: 0 };
      }

      if (isIncoming) {
        targetUser.unreadCount = (targetUser.unreadCount || 0) + 1;
      }
      if (message) {
        targetUser.lastMessage = message;
      }

      state.prevChatUsers = [targetUser, ...existingUsers];
    },
    markChatAsRead: (state, action) => {
      const targetId = action.payload?.toString();
      if (!targetId || !state.prevChatUsers) return;
      state.prevChatUsers = state.prevChatUsers.map((u) => {
        const uId = (u._id || u)?.toString();
        if (uId === targetId) {
          return { ...u, unreadCount: 0 };
        }
        return u;
      });
    },
    removeChatUser: (state, action) => {
      const targetId = action.payload?.toString();
      if (!targetId) return;
      if (state.prevChatUsers) {
        state.prevChatUsers = state.prevChatUsers.filter(
          (u) => (u._id || u)?.toString() !== targetId
        );
      }
      if (
        state.selectedUser &&
        (state.selectedUser._id || state.selectedUser)?.toString() === targetId
      ) {
        state.selectedUser = null;
        state.messages = [];
      }
    },
    removeMessage: (state, action) => {
      const messageId = action.payload?.toString();
      if (!messageId) return;
      state.messages = state.messages.filter(
        (m) => (m._id || m)?.toString() !== messageId
      );
      if (state.prevChatUsers) {
        state.prevChatUsers = state.prevChatUsers.map((u) => {
          if ((u.lastMessage?._id || u.lastMessage)?.toString() === messageId) {
            return { ...u, lastMessage: null };
          }
          return u;
        });
      }
    },
  },
});

export const {
  setSelectedUser,
  setMessages,
  addMessage,
  setPrevChatUsers,
  moveChatToTop,
  markChatAsRead,
  removeChatUser,
  removeMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
