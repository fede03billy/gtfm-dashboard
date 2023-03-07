import '@/styles/globals.css';
import { PopupProvider } from '../components/popupContext';

export default function App({ Component, pageProps }) {
  return (
    <PopupProvider>
      <Component {...pageProps} />
    </PopupProvider>
  );
}
