import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';
import { ToastContainer } from 'react-toastify';
import ReduxProvider from '@/components/common/ReduxProvider';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export const metadata = {
  title: { default: 'ClassicMart – Your Online Store', template: '%s | ClassicMart' },
  description: 'Shop the best products at ClassicMart – your one-stop online store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Header />
          <main style={{ minHeight: '60vh' }}>{children}</main>
          <Footer />
          <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar={false} theme="light" />
        </ReduxProvider>
      </body>
    </html>
  );
}
