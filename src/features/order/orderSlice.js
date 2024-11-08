import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
  page:1
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {

      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);

      dispatch(
        showToastMessage({ message: "주문에 성공했습니다.", status: "success" })
      );
      dispatch(getCartQty());
      
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error,
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order/me")
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    console.log("🚀 ~ query:", query)
    try {
      const response = await api.get("/order", { params: { ...query } })
      if (response.status !== 200) throw new Error(response.error);
      dispatch(setPage(query.page))
      dispatch(setOrderNum(query.orderNum))
      return response.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue, getState }) => {
    try {
      const response = await api.put(`/order/${id}`, {status:status})
      console.log("🚀 ~ response:", response)

      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({ message: "주문 수정 성공", status: "success" })
      );
      const { page, orderNum } = getState().order;

      dispatch(getOrderList({ page, orderNum}))

    } catch (error) {
      dispatch(
        showToastMessage({ message: "주문 수정 실패", status: "error" })
      );
      return rejectWithValue(error.error);
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setPage: (state, action) => { // 페이지 번호 업데이트 액션
      state.page = action.payload;
    },
    setOrderNum: (state, action) => { // 주문 번호 업데이트 액션
      state.orderNum = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createOrder.pending, (state)=>{
      state.loading = true;
    })
    .addCase(createOrder.fulfilled, (state, action)=>{
      state.loading = false;
      state.error = "";
      state.orderNum = action.payload;
    })
    .addCase(createOrder.rejected, (state, action)=>{
      state.loading = false;
      state.error = action.payload
    })
    .addCase(getOrder.pending, (state)=>{
      state.loading = true;
    })
    .addCase(getOrder.fulfilled, (state,action)=>{
      state.loading = true;
      state.error = "";
      state.orderList = action.payload;
    })
    .addCase(getOrder.rejected, (state,action)=>{
      state.loading = true;
      state.error = action.payload;
    })
    .addCase(getOrderList.pending, (state)=>{
      state.loading = true;
    })
    .addCase(getOrderList.fulfilled, (state,action)=>{
      state.loading = true;
      state.error = "";
      state.orderList = action.payload.data;
      state.totalPageNum = action.payload.totalPageNum;
    })
    .addCase(getOrderList.rejected, (state,action)=>{
      state.loading = true;
      state.error = action.payload;
    })
    .addCase(updateOrder.pending, (state)=>{
      state.loading = true;
    })
    .addCase(updateOrder.fulfilled, (state,action)=>{
      state.loading = true;
      state.error = "";
    })
    .addCase(updateOrder.rejected, (state,action)=>{
      state.loading = true;
      state.error = action.payload;
    })
    ;
  },
});

export const { setSelectedOrder, setPage, setOrderNum } = orderSlice.actions;
export default orderSlice.reducer;
