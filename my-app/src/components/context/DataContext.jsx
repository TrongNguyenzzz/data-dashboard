import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  data: [],
};

export const DataContext = createContext(INITIAL_STATE);

const DataReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    default:
      return state;
  }
};

export const DataContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(DataReducer, INITIAL_STATE);

  return (
    <DataContext.Provider
      value={{
        data: state.data,
        dispatch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};