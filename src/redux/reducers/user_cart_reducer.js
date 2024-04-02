import { GET_CART_LIST } from "../actions/user_cart_action";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  loading: false,
  error: false,
  errorData: {},
};

// const user_cart_reducer = (state = initState, { payload, type }) => {
//   if (type === GET_CART_LIST) {
//     state = { ...state, loading: false, data: payload };
//   }

//   return state;
// };

// export default user_cart_reducer;

const user_cart_slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setGetCartList(state, { payload }) {
      return { ...state, laoding: false, data: payload };
    },
  },
});

export const { setGetCartList } = user_cart_slice.actions;

export default user_cart_slice.reducer;
