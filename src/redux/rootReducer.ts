import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { AuthCfg, dashboardCfg, TopnavbarCfg } from './config';
import AuthReducer from './reducers/AuthReducer';
import ThemeReducer from './reducers/ThemeReducer';
import ClientsReducer from './reducers/ClientsReducer';
import DashboardReducer from './reducers/DashboardReducer';
import AdminReducer from './reducers/AdminReducer';
import FormsReducer from './reducers/FormReducer';
import ReportReducer from './reducers/ReportReducer';
import TopnavbarReducer from './reducers/TopnavbarReducer';

const appReducer = combineReducers({
    themeReducer: ThemeReducer,
    authReducer: persistReducer(AuthCfg, AuthReducer),
    dashboardReducer: persistReducer(dashboardCfg, DashboardReducer),
    topNavbarReducer: persistReducer(TopnavbarCfg, TopnavbarReducer),
    reportReducer: ReportReducer,
    adminReducer:AdminReducer,
    formsReducer: FormsReducer,
    clientsReducer: ClientsReducer,
})  

export default appReducer