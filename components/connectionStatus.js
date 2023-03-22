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
      div.classList.remove('border-red-500');
      return 'border-green-500';
    }
    if (!status) {
      div.classList.remove('border-green-500');
      return 'border-red-500';
    }
  }

  useEffect(() => {
    // add the class to the div
    const div = document.querySelector('.connection-status');
    div.classList.add(addClass(div));
  }, [status]);

  return (
    <div className="flex justify-center items-center p-2 connection-status border">
      {/* <div className="connection-status__icon">
            {isConnected ? (
            <img src="/connected.svg" alt="connected" />
            ) : (
            <img src="/disconnected.svg" alt="disconnected" />
            )}
        </div> */}
      <div className="text-xs " onClick={reloadPage}>
        {status ? 'Connesso' : 'Disconnesso'}
      </div>
    </div>
  );
}
