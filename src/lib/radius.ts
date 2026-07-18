// lib/radius.ts

/**
 * EXPAND RADIUS BY RING
 * Ring 1: local (±5)
 * Ring 2: nearby (±10)
 * Ring 3: extended (±20)
 * Ring 4: citywide (±40)
 *
 * Replace with real geo-distance later.
 */
export function expandRadiusPostcodes(
  basePostcode: string,
  ring: number
): string[] {
  const base = parseInt(basePostcode, 10);

  const ranges: Record<number, number> = {
    1: 5,
    2: 10,
    3: 20,
    4: 40,
  };

  const radius = ranges[ring] ?? 5;

  const postcodes: string[] = [];

  for (let i = base - radius; i <= base + radius; i++) {
    postcodes.push(String(i));
  }

  return postcodes;
}
