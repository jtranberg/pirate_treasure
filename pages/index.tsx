import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { disconnect } from 'process';

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  return (
     <div>
        {address ? (
    <>
    <button onClick={disconnectWallet}>Disconnect wallet</button>
    <p>Your Address: {address}</p>
    </>
   ) : (
       <button onClick={connectWithMetamask}>Connect with Metamask</button>
   )}
    </div>
  );
};

export default Home;
