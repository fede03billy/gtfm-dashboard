// component that shows the connection status depending on the props

import { useEffect } from 'react';

export default function ConnectionStatus({ status }) {
  // function that reloads the page on click forcing the ws reconnection
  function reloadPage() {
    if (status) return;
    if (!status) window.location.reload();
  }

  // function to add the class with border green or red depending on the status and removing other border colors
  function addClass(div) {
    if (status) {
      div.classList.remove('bg-red-500');
      return 'bg-green-500';
    }
    if (!status) {
      div.classList.remove('bg-green-500');
      return 'bg-red-500';
    }
  }

  useEffect(() => {
    // add the class to the div
    const div = document.querySelector('.connection-status');
    div.classList.add(addClass(div));
  }, [status]);

  return (
    <div className="flex justify-center items-center p-2">
      {/* <div className="connection-status__icon">
            {isConnected ? (
            <img src="/connected.svg" alt="connected" />
            ) : (
            <img src="/disconnected.svg" alt="disconnected" />
            )}
        </div> */}
      <button
        className="text-xs  px-4 py-2 h-8 my-auto connection-status rounded bg-red-500"
        onClick={reloadPage}
      >
        {status ? 'Connesso' : 'Disconnesso'}
      </button>
    </div>
  );
}
