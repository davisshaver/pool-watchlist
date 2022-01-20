import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import nookies, { setCookie } from "nookies";
import { useState } from "react";
import { gql } from "@apollo/client";

import client from "../../apollo-client";
import { formatterUSD } from "../../utilities/formatting";
import PoolLogos from "../../components/poolLogos";

// @TODO Fix price display (possibly use bundle query, or ~~math~~).
// @TODO Add transaction list w/ pagination.
// @TODO Integrate transaction type filter.
const PoolDetail: NextPage<{ pool: any; watchlist: string[] }> = ({
  pool,
  watchlist,
}) => {
  // Extract pool GUID from the route.
  const router = useRouter();
  const id = router.query.id as string;

  // Keep track of watchlist status locally to conditionally render button.
  const [onWatchList, setOnWatchList] = useState(watchlist.includes(id));

  /**
   * Safely add a pool GUID to watchlist, ensuring uniqueness.
   *
   * @param {number} addId Pool GUID to add to watchlist.
   */
  const addToWatchList = (addId: string) => {
    setCookie(
      null,
      "watchlist",
      JSON.stringify([...new Set([...watchlist, addId])]),
      {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      }
    );
    setOnWatchList(true);
  };

  /**
   * Safely remove a pool GUID from watchlist.
   *
   * @param {number} removeId Pool GUID to remove from watchlist.
   */
  const removeFromWatchList = (removeId: string) => {
    setCookie(
      null,
      "watchlist",
      JSON.stringify(watchlist.filter((checkId) => checkId !== removeId)),
      {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      }
    );
    setOnWatchList(false);
  };

  return (
    <div>
      <Head>
        <title>
          Pool House - {pool[0].token0.symbol}/{pool[0].token1.symbol}
        </title>
      </Head>
      <main className="p-5">
        <Link href="/">
          <a className="text-xl pb-1.5">◀ Back to Pools</a>
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <h1 className="text-2xl pb-1.5">
            <PoolLogos
              token0ID={pool[0].token0.id}
              token1ID={pool[0].token1.id}
            />
            {pool[0].token0.symbol}/{pool[0].token1.symbol}
          </h1>
          {!onWatchList ? (
            <button
              className="text-xl bg-sky-500 text-white rounded"
              onClick={() => addToWatchList(id)}
            >
              ⭐️ Add to Watchlist
            </button>
          ) : (
            <button
              className="text-xl bg-white text-sky-500 rounded border border-sky-500"
              onClick={() => removeFromWatchList(id)}
            >
              Remove from Watchlist
            </button>
          )}
        </div>
        <table className="table-fixed w-1/2">
          <thead>
            <tr>
              <th className="text-left">Token</th>
              <th>Value (USD)</th>
              <th>TX Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img
                  className="inline-block	"
                  height={16}
                  src={`/icons/${pool[0].token0.id}/logo.png`}
                  width={16}
                />{" "}
                {pool[0].token0.symbol}
              </td>
              <td className="text-center">
                {formatterUSD.format(pool[0].token0Price) }
              </td>
              <td className="text-center">
                {parseInt(pool[0].token0.txCount).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td>
                <img
                  className="inline-block"
                  height={16}
                  src={`/icons/${pool[0].token1.id}/logo.png`}
                  width={16}
                />{" "}
                {pool[0].token1.symbol}
              </td>
              <td className="text-center">
                {formatterUSD.format(pool[0].token1Price)}
              </td>
              <td className="text-center">
                {parseInt(pool[0].token1.txCount).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex items-center pt-5 pb-1.5">
          <h1 className="text-2xl pr-2">Transactions</h1>
          <select>
            <option>Swap</option>
            <option>Burn</option>
            <option>Mint</option>
            <option>All</option>
          </select>
        </div>
        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th className="text-left">Link to Etherscan</th>
              <th>TX Type</th>
              <th>Token Amount (USD)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left">https://etherscan.io/....</td>
              <td className="text-center">swap</td>
              <td className="text-center">$10.87k USDC</td>
              <td className="text-center">14 minutes ago</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

PoolDetail.getInitialProps = async (ctx) => {
  // Get watchlist from cookies.
  const cookies = nookies.get(ctx);
  const watchlist = cookies.watchlist ? JSON.parse(cookies.watchlist) : [];

  // Individual pool query.
  // @TODO Move this query to a separate file.
  const INDIVIDUAL_POOL_QUERY = gql`
    query IndividualPools {
      pools(
        where: {
          id: ${JSON.stringify(ctx.query.id)}
        }
      ) {
        token0Price
        token0 {
          id
          symbol
          txCount
        }
        token1Price
        token1 {
          id
          symbol
          txCount
        }
      }
    }
  `;

  // Run pool query.
  const poolQuery = await client.query({
    query: INDIVIDUAL_POOL_QUERY,
  });

  return { pool: poolQuery.data.pools, watchlist };
};

export default PoolDetail;
