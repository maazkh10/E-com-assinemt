import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface IAuthState {
  isAuthorized: boolean;
}
const initialState: IAuthState = {
  isAuthorized: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
  },
});

export const { setAuthorized } = authSlice.actions;
export default authSlice.reducer;
