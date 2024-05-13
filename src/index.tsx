import ReactDOM from 'react-dom/client';
import './index.css';
import { AppRoutes } from './configs/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
