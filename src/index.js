import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GoogleOAuthProvider } from "@react-oauth/google"
import { QueryClientProvider, QueryClient} from "react-query"
import { ThemeProvider } from "@mui/material/styles"
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId='639556515777-994g5ech9br4e0k9qtsn58skjdr67qgd.apps.googleusercontent.com'>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </BrowserRouter>
);