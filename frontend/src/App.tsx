import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider, ToastProvider, SessionProvider, LocaleProvider } from '@/providers';
import { OfflineBanner } from '@/components/layout';
import { router } from '@/router';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocaleProvider>
          <SessionProvider>
            <ToastProvider>
              <OfflineBanner />
              <RouterProvider router={router} />
            </ToastProvider>
          </SessionProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
