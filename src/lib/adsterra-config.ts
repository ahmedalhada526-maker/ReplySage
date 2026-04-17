/**
 * Adsterra Ads Configuration
 *
 * استبدل القيم التالية بمفاتيح حسابك الفعلية من لوحة Adsterra.
 * كل قسم يحتوي على placeholder واضح. عندما تتركها فارغة لن يظهر الإعلان.
 */

export const ADSTERRA = {
  /** Banner 728x90 — Desktop */
  bannerDesktop: {
    key: "REPLACE_WITH_DESKTOP_BANNER_KEY",
    format: "iframe",
    height: 90,
    width: 728,
    params: {},
  },
  /** Banner 320x50 — Mobile */
  bannerMobile: {
    key: "REPLACE_WITH_MOBILE_BANNER_KEY",
    format: "iframe",
    height: 50,
    width: 320,
    params: {},
  },
  /** Native Banner — script src + container id */
  native: {
    scriptSrc: "//REPLACE_WITH_NATIVE_INVOKE_URL.js",
    containerId: "container-REPLACE_WITH_NATIVE_KEY",
  },
  /** Social Bar — full script src e.g. //pl12345.profitableratecpm.com/xx/xx/xx/xxxxx.js */
  socialBar: {
    scriptSrc: "//REPLACE_WITH_SOCIAL_BAR_SCRIPT_URL.js",
  },
} as const;

export const isPlaceholder = (val: string) => val.includes("REPLACE_WITH_");
