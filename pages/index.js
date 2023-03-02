import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Navbar from '../components/navbar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import hider from 'simple-hider';

export default function Home() {
  const router = useRouter();
  const [selection, setSelection] = useState('ORDINI');

  useEffect(() => {
    // check if there's a token called gtfm_token in the cookies
    // if there is, render the dashboard
    // if there isn't, render the login page
    if (
      typeof window !== 'undefined' &&
      document.cookie.includes('gtfm_token')
    ) {
      //save the token in a variable, unhide it and parse it to JSON
      let gtfm_token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('gtfm_token'))
        .split('=')[1];
      let restaurantInfo = JSON.parse(hider.unhide('precauzione', gtfm_token));
      console.log(restaurantInfo);
    } else {
      console.log('token not found');
      router.push('/login');
    }
  }, []);

  return (
    <>
      <Head>
        <title>GTFM - Dashboard</title>
        <meta name="description" content="GTFM  - Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="w-1/5">
          <Navbar setter={setSelection}></Navbar>
        </div>
        <div className="w-5/6">
          {selection === 'ORDINI' && <div>CONTENUZIO</div>}
          {selection === 'MENU' && <div>MENU</div>}
          {selection === 'PAGAMENTI' && <div>LINK AI PAGAMENTI STRIPE</div>}
          {selection === 'SETTINGS' && <div>IMPOSTAZIE</div>}
        </div>
      </main>
    </>
  );
}
