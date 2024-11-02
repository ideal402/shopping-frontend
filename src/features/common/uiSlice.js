import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toastMessage: { message: "", status: "" },
  // 'success', 'error', 'warning'
  loadingCount: 0, // 로딩 상태 추가
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToastMessage(state, action) {
      state.toastMessage = {
        message: action.payload.message,
        status: action.payload.status,
      };
    },
    hideToastMessage(state) {
      state.open = false;
    },
    incrementLoading(state) {
      state.loadingCount += 1; // 로딩 시작 시 증가
    },
    decrementLoading(state) {
      state.loadingCount = Math.max(state.loadingCount - 1, 0); // 로딩 종료 시 감소
    },
  },
});

export const { showToastMessage, hideToastMessage, incrementLoading, decrementLoading } = uiSlice.actions;
export default uiSlice.reducer;
