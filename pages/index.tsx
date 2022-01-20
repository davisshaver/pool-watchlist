import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import nookies from "nookies";
import { gql } from "@apollo/client";

import client from "../apollo-client";
import { formatterUSD } from "../utilities/formatting";
import PoolTable from "../components/poolTable";

// @TODO Write structure for pools items, remove use of any.
// @TODO Add/integrate query pagination, add pagination buttons.
// @TODO Take a visual design pass over application.
const PoolHouse: NextPage<{
  watchListPools: any;
  otherPools: any;
}> = ({ otherPools, watchListPools }) => {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Pool House</title>
      </Head>
      <main className="p-5">
        <h1 className="text-2xl pb-1.5">Pool Watchlist</h1>
        {watchListPools.length !== 0 ? (
          <>
            <PoolTable pools={watchListPools} />
          </>
        ) : (
          <h2 className="text-xl">Your pools will appear here</h2>
        )}
        <h1 className="text-2xl pt-5 pb-1.5">All Pools</h1>
        <PoolTable pools={otherPools} />
      </main>
    </div>
  );
};

PoolHouse.getInitialProps = async (ctx) => {
  // Get watchlist from cookies.
  const cookies = nookies.get(ctx);
  const watchlist = cookies.watchlist ? JSON.parse(cookies.watchlist) : [];

  // Watchlist query (only run if watchlist has items).
  // @TODO Move this query to a separate file.
  const WATCH_LIST_QUERY = gql`
    query WatchListPools {
      pools(
        where: {
          id_in: ${JSON.stringify(watchlist)}
        },
        orderBy: "totalValueLockedUSD",
        orderDirection: "desc"
      ) {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        txCount
        totalValueLockedUSD
        volumeUSD
      }
    }
  `;

  // Filter for other pools query in case of non-empty watchlist.
  const otherPoolsFilter =
    watchlist.length !== 0
      ? `where: {
          id_not_in: ${JSON.stringify(watchlist)}
        },`
      : "";

  // Other pools query.
  // @TODO Move this query to a separate file.
  const OTHER_POOLS_QUERY = gql`
    query OtherPools {
      pools(
        ${otherPoolsFilter}
        orderBy: "totalValueLockedUSD",
        orderDirection: "desc",
        first: 20
      ) {
        id
        token0 {
          id
          symbol
          name
        }
        token1 {
          id
          symbol
          name
        }
        txCount
        totalValueLockedUSD
        volumeUSD
      }
    }
  `;

  // Backup watchlist query for cases where watchlist empty.
  let watchListQuery = {
    data: {
      pools: [],
    },
  };

  // Run watchlist query only when applicable.
  if (watchlist.length !== 0) {
    watchListQuery = await client.query({
      query: WATCH_LIST_QUERY,
    });
  }

  // Always run other pools query.
  // @TODO Add pagination to this query.
  // @TODO Compose into single query.
  const otherPoolsQuery = await client.query({
    query: OTHER_POOLS_QUERY,
  });

  return {
    watchListPools: watchListQuery.data.pools,
    otherPools: otherPoolsQuery.data.pools,
  };
};

export default PoolHouse;
