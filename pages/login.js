// page that handles the login process and stores in the user's cookie the token

import { useState } from 'react';
import { useRouter } from 'next/router';
import hider from 'simple-hider';
import { getCookie, setCookie } from 'cookies-next';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // fetch '/api/login'
    // if successful, redirect to '/'
    // if not, set error
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: hider.hide('precauzione', password),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          const { gtfm_token } = data;
          setCookie('gtfm_token', gtfm_token);
          router.push('/');
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-4xl font-bold">GTFM</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center w-1/3"
      >
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="w-full p-2 my-2 border border-gray-400 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 my-2 border border-gray-400 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 my-2 text-white bg-gray-500 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
