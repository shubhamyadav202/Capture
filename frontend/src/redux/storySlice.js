import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: null,
    storyList: null,
    currentUserStory: null,
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },
    setStoryList: (state, action) => {
      state.storyList = action.payload;
    },
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;
    },
    removeStory: (state, action) => {
      const { storyId, authorId } = action.payload || {};
      if (state.storyList) {
        state.storyList = state.storyList.filter((s) => {
          const sId = s?._id?.toString();
          const sAuthorId = (s?.author?._id || s?.author)?.toString();
          if (storyId && sId === storyId.toString()) return false;
          if (authorId && sAuthorId === authorId.toString()) return false;
          return true;
        });
      }
      if (state.storyData) {
        const currentStoryId = state.storyData?._id?.toString();
        const currentAuthorId = (
          state.storyData?.author?._id || state.storyData?.author
        )?.toString();
        if (
          (storyId && currentStoryId === storyId.toString()) ||
          (authorId && currentAuthorId === authorId.toString())
        ) {
          state.storyData = null;
        }
      }
      if (state.currentUserStory) {
        const curUserStoryId = state.currentUserStory?._id?.toString();
        const curUserAuthorId = (
          state.currentUserStory?.author?._id || state.currentUserStory?.author
        )?.toString();
        if (
          (storyId && curUserStoryId === storyId.toString()) ||
          (authorId && curUserAuthorId === authorId.toString())
        ) {
          state.currentUserStory = null;
        }
      }
    },
    addStoryToList: (state, action) => {
      const newStory = action.payload;
      if (!newStory) return;
      const newAuthorId = (
        newStory.author?._id || newStory.author
      )?.toString();
      if (!state.storyList) {
        state.storyList = [newStory];
      } else {
        const filtered = state.storyList.filter(
          (s) =>
            (s?.author?._id || s?.author)?.toString() !== newAuthorId,
        );
        state.storyList = [newStory, ...filtered];
      }
    },
  },
});

export const {
  setStoryData,
  setStoryList,
  setCurrentUserStory,
  removeStory,
  addStoryToList,
} = storySlice.actions;
export default storySlice.reducer;
