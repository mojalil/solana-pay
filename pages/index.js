import React, {useEffect, useState} from "react"
import Product from "../components/Product"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

const TWITTER_HANDLE = "@motypes"
const TWITTER_URL = "https://twitter.com/" + TWITTER_HANDLE
const TWITTER_ICON = "https://pbs.twimg.com/profile_images/1209898984/twitter_icon_normal.png"

const App = () => {
  // This will fetch the users' public key (wallet address) from any wallet we support
  const { publicKey } = useWallet();
  const [products, setProducts] = useState([])
  useEffect(() => {
    if(publicKey){
      fetch(`/api/fetchProducts`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        console.log("Products", data)
      })
    }
  }, [publicKey]);

  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>    
    </div>
  );

  const renderItemBuyContainer = () => (
    <div className="product-container">
      {products.map(product => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )


  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <p className="header"> 😳 Motypes Emoji Store 😈</p>
          <p className="sub-text">The only emoji store that accepts shitcoins</p>
        </header>

        <main>
          {/* We only render the connect button if public key doesn't exist */}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}

        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_URL}
            target="_blank"
            rel="noreferrer"
          >{`built by ${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;