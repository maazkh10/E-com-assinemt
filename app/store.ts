import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import filterReducer from "./features/filterSlice";
import searchReducer from "./features/searchSlice";
import authReducer from "./features/authSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filter: filterReducer,
    search: searchReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
