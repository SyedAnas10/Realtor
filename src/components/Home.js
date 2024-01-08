import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';

const Home = ({ home, homeIndex, provider, account, escrow, propertyContract, togglePop }) => {
    const [hasBought, setHasBought] = useState(false)
    const [hasLended, setHasLended] = useState(false)
    const [hasInspected, setHasInspected] = useState(false)
    const [hasSold, setHasSold] = useState(false)

    const [owner, setOwner] = useState(null)

    const fetchOwner = async () => {
        const owner = await propertyContract.ownerOf(homeIndex)
        setOwner(owner)
    }

    useEffect(() => {
        fetchOwner()
    }, [])

    const initiateEscrow = async () => {
        try {
            const signer = await provider.getSigner()
            const transaction = await escrow.connect(signer).createEscrow(owner, homeIndex, home.price.toNumber(), {value: home.price.toNumber() / 2})
            await transaction.wait()     
        } catch (error) {
            console.error('Error creating escrow:', error);
        }
    }

    return (
        <div className="home">
            <div className='home__details'>
                <div className="home__image">
                    <img src={'https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/3.png'} alt="Home" />
                </div>
                <div className="home__overview">
                    <h1>{home.name}</h1>
                    <p>
                    <strong>{home.bedroom.toNumber()}</strong> bds |
                  <strong>{home.bathroom.toNumber()}</strong> ba |
                  <strong>{home.area.toNumber()}</strong> sqft
                    </p>
                    <p>{home.address}</p>

                    <h2>{home.price.toNumber()} ETH</h2>

                    {owner && (
                        <div className='home__owned'>
                            Owned by {owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                        </div>
                    )}
                    {owner && owner !== account && (
                            <div>
                                <button className='home__buy' onClick={initiateEscrow} disabled={hasBought}>
                                    Buy
                                </button>
                            </div>
                    )}
                    <hr />

                    <h2>Overview</h2>

                    <ul>
                        <li><strong>{home.bedroom.toNumber()}</strong> bds | </li>
                        <li><strong>{home.bathroom.toNumber()}</strong> ba | </li>
                        <li><strong>{home.area.toNumber()}</strong> sqft </li>
                    </ul>
                </div>


                <button onClick={togglePop} className="home__close">
                    <img src={close} alt="Close" />
                </button>
            </div>
        </div >
    );
}

export default Home;