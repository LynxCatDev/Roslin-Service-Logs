import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Theme } from '@radix-ui/themes';
import { store, persistor } from './store/store';
import '@radix-ui/themes/styles.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Theme>
          <App />
        </Theme>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
