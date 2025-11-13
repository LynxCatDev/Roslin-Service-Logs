import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { getDrafts, getLogs } from './utils/localStorage';
import { setDrafts } from './store/draftSlice';
import { setServiceLogs } from './store/serviceLogSlice';
import type { Draft, ServiceLog } from './types';
import './index.css';
import App from './App.tsx';

// Load persisted data from LocalStorage
const drafts = getDrafts<Draft>();
const logs = getLogs<ServiceLog>();
store.dispatch(setDrafts(drafts));
store.dispatch(setServiceLogs(logs));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
