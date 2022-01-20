import { formatterUSD } from "../utilities/formatting";
import { useRouter } from "next/router";

import PoolLogos from "./poolLogos";

// @TODO Integrate fee percentage to differentiate dupe pairs.
// @TODO Add ability to click on column headers to sort.
// @TODO Integrate pagination.
// @TODO Update formatter to shorten figures (e.g. $###.##m) w/ verbose tooltip.
// @TODO Replace table element with flexbox/links to enable right click/copy URL.
export const PoolTable = ({ pools }: { pools: any }) => {
  const router = useRouter();
  return (
    <div className="rounded border-2 p-1.5">
      <table className="table-fixed w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left">Pool</th>
            <th>TX Count</th>
            <th>TVL (USD)</th>
            <th>Volume (USD)</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool: any) => (
            <tr
              className="cursor-pointer"
              key={pool.id}
              onClick={() => router.push(`/pools/${pool.id}`)}
            >
              <td className="text-left">
                <PoolLogos
                  token0ID={pool.token0.id}
                  token1ID={pool.token1.id}
                />
                {pool.token0.symbol}/{pool.token1.symbol}
              </td>
              <td className="text-center">
                {parseInt(pool.txCount).toLocaleString()}
              </td>
              <td className="text-center">
                {formatterUSD.format(pool.totalValueLockedUSD)}
              </td>
              <td className="text-center">
                {formatterUSD.format(pool.volumeUSD)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PoolTable;
