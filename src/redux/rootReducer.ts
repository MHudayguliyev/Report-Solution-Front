import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AuthReducer from './reducers/AuthReducer';
import ThemeReducer from './reducers/ThemeReducer';
import ClientsReducer from './reducers/ClientsReducer';
import DashboardReducer from './reducers/DashboardReducer';
import FormsReducer from './reducers/FormReducer';
import ReportReducer from './reducers/ReportReducer';
import TopnavbarReducer from './reducers/TopnavbarReducer';
import { dashboardCfg, TopnavbarCfg } from './config';

const appReducer = combineReducers({
    themeReducer: ThemeReducer,
    authReducer: AuthReducer,
    dashboardReducer: persistReducer(dashboardCfg, DashboardReducer),
    topNavbarReducer: persistReducer(TopnavbarCfg, TopnavbarReducer),
    reportReducer: ReportReducer,
    formsReducer: FormsReducer,
    clientsReducer: ClientsReducer,
})  

export default appReducer