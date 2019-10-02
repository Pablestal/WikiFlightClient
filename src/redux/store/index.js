import { createStore, applyMiddleware } from "redux";
import reducers from "../reducers";
import reduxThunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["auth", "aerod"]
};

const apersistReducer = persistReducer(persistConfig, reducers);

export const store = createStoreWithMiddleware(apersistReducer);
export const persistor = persistStore(store);
