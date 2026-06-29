/* ============================================================================
   config.js  —  central configuration
   --------------------------------------------------------------------------
   API: Finnhub (https://finnhub.io) — a free, key-based public API.
   Register for a free key, then paste it below.  The free tier allows 60
   calls/minute and supports browser (CORS) requests, which is why it suits a
   static deployment on Vercel / Netlify / GitHub Pages.

   NOTE (for your engineering log): a client-side key is visible in the
   browser. That is acceptable for a free, read-only student demo, but in a
   real product the key would live on a backend proxy.
   ========================================================================== */

const CONFIG = {
  // 1) Replace this with your own free key from https://finnhub.io/register
  FINNHUB_KEY: "d90p2v1r01qlp5tth6g0d90p2v1r01qlp5tth6gg",

  BASE_URL: "https://finnhub.io/api/v1",
  PAGE_SIZE: 6,           // cards per page (pagination)
};

/* ---------------------------------------------------------------------------
   WATCHLIST — your own curated dataset (25 real companies + sectors).
   This satisfies the "15+ real items of your own content" requirement.
   Live price/change is layered on top from the API at runtime.
   ------------------------------------------------------------------------- */
const WATCHLIST = [
  { symbol: "AAPL",  name: "Apple",            sector: "Technology"  },
  { symbol: "MSFT",  name: "Microsoft",        sector: "Technology"  },
  { symbol: "NVDA",  name: "NVIDIA",           sector: "Technology"  },
  { symbol: "GOOGL", name: "Alphabet",         sector: "Technology"  },
  { symbol: "META",  name: "Meta Platforms",   sector: "Technology"  },
  { symbol: "AMZN",  name: "Amazon",           sector: "Consumer"    },
  { symbol: "TSLA",  name: "Tesla",            sector: "Automotive"  },
  { symbol: "JPM",   name: "JPMorgan Chase",   sector: "Financials"  },
  { symbol: "GS",    name: "Goldman Sachs",    sector: "Financials"  },
  { symbol: "MS",    name: "Morgan Stanley",   sector: "Financials"  },
  { symbol: "BLK",   name: "BlackRock",        sector: "Financials"  },
  { symbol: "V",     name: "Visa",             sector: "Financials"  },
  { symbol: "MA",    name: "Mastercard",       sector: "Financials"  },
  { symbol: "XOM",   name: "Exxon Mobil",      sector: "Energy"      },
  { symbol: "CVX",   name: "Chevron",          sector: "Energy"      },
  { symbol: "JNJ",   name: "Johnson & Johnson",sector: "Healthcare"  },
  { symbol: "PFE",   name: "Pfizer",           sector: "Healthcare"  },
  { symbol: "UNH",   name: "UnitedHealth",     sector: "Healthcare"  },
  { symbol: "WMT",   name: "Walmart",          sector: "Consumer"    },
  { symbol: "KO",    name: "Coca-Cola",        sector: "Consumer"    },
  { symbol: "PEP",   name: "PepsiCo",          sector: "Consumer"    },
  { symbol: "DIS",   name: "Walt Disney",      sector: "Media"       },
  { symbol: "NFLX",  name: "Netflix",          sector: "Media"       },
  { symbol: "BA",    name: "Boeing",           sector: "Industrials" },
  { symbol: "CAT",   name: "Caterpillar",      sector: "Industrials" },
];
