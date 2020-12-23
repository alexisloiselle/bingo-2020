import sr, { prng } from "seedrandom";

export const getSeed = (value: string): prng => {
  return sr(value.toLowerCase());
};

export const getGrid = (
  defaultSeed: prng,
  cells: readonly { readonly id: number; readonly value: string }[]
) => {
  let seed = defaultSeed.double();
  let array = [...cells];
  let m = array.length,
    t,
    i;

  while (m) {
    i = Math.floor(seed * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }

  return array.filter((v) => !!v);
};
