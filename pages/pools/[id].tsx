import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import nookies, { setCookie } from 'nookies'
import { useState } from 'react'

const PoolDetail: NextPage<{ watchlist: number[] }> = ({ watchlist }) => {
    // Extract pool GUID from the route.
    const router = useRouter()
    const id = parseInt(router.query.id as string, 10)

    // Keep track of watchlist status locally to conditionally render button.
    const [onWatchList, setOnWatchList] = useState(watchlist.includes(id))

    /**
     * Safely add a pool GUID to watchlist, ensuring uniqueness.
     *
     * @param {number} addId Pool GUID to add to watchlist.
     */
    const addToWatchList = (addId: number) => {
        setCookie(null, 'watchlist', JSON.stringify(
            [...new Set([...watchlist, addId])]
        ), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
        setOnWatchList(true)
    }

    /**
     * Safely remove a pool GUID from watchlist.
     *
     * @param {number} removeId Pool GUID to remove from watchlist.
     */
    const removeFromWatchList = (removeId: number) => {
        setCookie(null, 'watchlist', JSON.stringify(
            watchlist.filter(checkId => checkId !== removeId)
        ), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
        setOnWatchList(false)
    }

    return (
        <div>
            <Head>
                <title>Pool detail</title>
            </Head>
            <main>
                <Link href="/"><a>◀ Back to Pools</a></Link>
                <div className="grid grid-cols-2 gap-2">
                    <h1>🔵🟢 USDC/ETH</h1>
                    {
                        !onWatchList ? (
                            <button
                                onClick={() => addToWatchList(id)}
                            >Add to Watchlist</button>
                        ) : (
                            <button
                                onClick={() => removeFromWatchList(id)}
                            >Remove from Watchlist</button>
                        )
                    }

                </div>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th>Tokens value (USD)</th>
                            <th>TX Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>🔵 USDC</td>
                            <td>422</td>
                        </tr>
                        <tr>
                            <td>🟢 ETH</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <h1>Transactions</h1>
                <select>
                    <option>Swap</option>
                    <option>Burn</option>
                    <option>Mint</option>
                    <option>All</option>
                </select>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th>Link to Etherscan</th>
                            <th>TX Type</th>
                            <th>Token Amount (USD)</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>https://etherscan.io/....</td>
                            <td>swap</td>
                            <td>$10.87k USDC</td>
                            <td>14 minutes ago</td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>
    )
}

PoolDetail.getInitialProps = async (ctx) => {
    const cookies = nookies.get(ctx)
    const watchlist = cookies.watchlist ? JSON.parse(cookies.watchlist) : [];
    return { watchlist }
}

export default PoolDetail
