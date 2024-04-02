import { configureStore } from "@reduxjs/toolkit";
// import lang_reducer from "./reducers/lang_reducer";
import user_reducer from "./reducers/user_reducer";
import user_cart_reducer from "./reducers/user_cart_reducer";

const store = configureStore({
  reducer: { user: user_reducer, cart: user_cart_reducer },
});

export default store;
