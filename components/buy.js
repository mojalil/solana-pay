import React, { useState, useMemo } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order

  const [paid, setPaid] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state of all above
  
  // useMemo is a React hook that only computes the value if the dependencies change
  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );


    const processTransaction = async () => {
        setLoading(true)
        const txResponse = await fetch("../api/createTransaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
             },
             body: JSON.stringify(order) 
        })

        const txData = await txResponse.json()

        const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        console.log(`Transaction: ${tx.toString()}`);

        try{
            const txHash = await sendTransaction(tx, connection);
            console.log(`Transaction sent with hash: https://solscan.io/tx/${txHash}?cluter=devnet`);
            setPaid(true)
        } catch(error) {
            console.log(error);
        }finally{
            setLoading(false)
        }

    }

    if(!publicKey){
        return (<div>You need to connect your wallet to make transactions</div>)
    }

    if(loading){
        return (<div><InfinitySpin /></div>)
    }

    return (
        <div>
          {paid ? (
            <IPFSDownload filename="emojis.zip" hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5" cta="Download emojis"/>
          ) : (
            <button disabled={loading} className="buy-button" onClick={processTransaction}>
              Buy now 🠚
            </button>
          )}
        </div>
      );    

}