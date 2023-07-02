import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ConnectToSocket } from '@utils/helpers';

// redux
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from '@redux/store';

// for translation
import i18n from "./libs/i18";
import { I18nextProvider } from "react-i18next";

import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./styles/global.scss";
import "./styles/theme.scss";
import "./styles/fonts.scss";
import { SocketContext } from './context/context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

let socket = ConnectToSocket()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <SocketContext.Provider value={socket}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </I18nextProvider>
      </SocketContext.Provider>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
)
