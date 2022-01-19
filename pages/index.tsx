import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import nookies from 'nookies'

const PoolHouse: NextPage<{ watchlist: number[] }> = ({ watchlist }) => {
  const router = useRouter()
  return (
    <div>
      <Head>
        <title>Pool home</title>
      </Head>
      <main>
        <h1>Pool Watchlist</h1>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Pool</th>
              <th>TX Count</th>
              <th>TVL (USD)</th>
              <th>Volume (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cursor-pointer" onClick={() => router.push('/pools/1')}>
              <td>🔵🟢 USDC/ETH</td>
              <td>16</td>
              <td>$271.56m</td>
              <td>$33.98m</td>
            </tr>
          </tbody>
        </table>
        <h1>All Pools</h1>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Pool</th>
              <th>TX Count</th>
              <th>TVL (USD)</th>
              <th>Volume (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cursor-pointer" onClick={() => router.push('/pools/1')}>
              <td>🔵🟢 USDC/ETH</td>
              <td>16</td>
              <td>$271.56m</td>
              <td>$33.98m</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}

PoolHouse.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  const watchlist = cookies.watchlist ? JSON.parse(cookies.watchlist) : [];
  return { watchlist }
}

export default PoolHouse
