import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../(tabs)";

interface SearchState {
  searchResults: Product[];
}

const initialState: SearchState = {
  searchResults: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<Product[]>) {
      state.searchResults = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
  },
});

export const { setSearchResults, clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
