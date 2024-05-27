import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Category } from "../(tabs)/_layout";

interface FilterState {
  selectedCategory: Category | null;
}

const initialState: FilterState = {
  selectedCategory: null,
};
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
