// @TODO Determine fallback strategy for missing icons.
// @TODO Add alt tags for logo images.
export const PoolLogos = ({
  token0ID,
  token1ID,
}: {
  token0ID: string
  token1ID: string;
}) => (
  <>
    <img
      className="inline-block"
      height={16}
      src={`/icons/${token0ID}/logo.png`}
      width={16}
    />
    <img
      className="inline-block relative z-10 -left-2"
      height={16}
      src={`/icons/${token1ID}/logo.png`}
      width={16}
    />{" "}
  </>
);

export default PoolLogos;
