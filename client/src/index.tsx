// src/main.tsx hoặc src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { BrowserRouter } from 'react-router-dom'; // 👉 Thêm dòng này

const rootElement = document.getElementById('root') as HTMLElement;
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter> {/* 👉 Bọc ở đây để Link hoạt động */}
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
