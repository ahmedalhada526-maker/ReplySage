/**
 * Adsterra Ads Configuration
 *
 * Live keys configured for production.
 * Leave a value empty / placeholder to disable that ad slot.
 */

export const ADSTERRA = {
  /** Banner 728x90 — Desktop */
  bannerDesktop: {
    key: "b3ba4630af50310bba016093f8887bec",
    format: "iframe",
    height: 90,
    width: 728,
    params: {},
  },
  /** Banner 320x50 — Mobile */
  bannerMobile: {
    key: "45f9be218813444f075caf31afba592b",
    format: "iframe",
    height: 50,
    width: 320,
    params: {},
  },
  /** Native Banner — script src + container id */
  native: {
    scriptSrc:
      "//pl29178332.profitablecpmratenetwork.com/4bc64ac09cdc6870631eabbe6537e9d5/invoke.js",
    containerId: "container-4bc64ac09cdc6870631eabbe6537e9d5",
  },
  /** Social Bar — full script src */
  socialBar: {
    scriptSrc:
      "//pl29178333.profitablecpmratenetwork.com/a0/ac/0d/a0ac0d6d81c2b19de60facb30eac7aa3.js",
  },
} as const;

export const isPlaceholder = (val: string) => val.includes("REPLACE_WITH_");
