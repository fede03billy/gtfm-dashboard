import '@/styles/globals.css';
import { PopupProvider } from '../components/popupContext';
import { OrdersProvider } from '../components/ordersContext';

export default function App({ Component, pageProps }) {
  return (
    <PopupProvider>
      <OrdersProvider>
        <Component {...pageProps} />
      </OrdersProvider>
    </PopupProvider>
  );
}
