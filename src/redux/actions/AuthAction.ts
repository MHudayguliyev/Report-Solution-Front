import { SetAuth, RefetchUserData } from "../types/AuthTypes";

const setAuth = (isAuthorized: boolean): SetAuth => {
  return {
    type: "SET_IS_AUTHORIZED",
    payload: isAuthorized,
  };
};
const refetchUserData = (state: boolean): RefetchUserData => {
  return {
    type: "REFETCH_USER_DATA",
    payload: state,
  };
};

const exportDefault = {
   setAuth,
   refetchUserData
};

export default exportDefault;
