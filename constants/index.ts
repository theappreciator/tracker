import { IronSessionOptions } from "iron-session";

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const THIRTY_DAYS_IN_SECONDS = ONE_DAY_IN_SECONDS * 30;
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS * 365;
const EFFECTIVELY_FOREVER_IN_SECONDS = ONE_YEAR_IN_SECONDS * 10;

export const ironSessionCookieOptions: IronSessionOptions = {
  cookieName: "thingtracker",
  password: process.env.IRON_SESSION_COMPLEX_PASSWORD || '',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: EFFECTIVELY_FOREVER_IN_SECONDS
  },
}

export const DEFAULT_USER_LOCALE = 'en-US';
export const DEFAULT_USER_TIMEZONE = 'America/New_York';

export const COLOR_RANGE = [
  "#ac1f1f",
  "#bf3c17",
  "#d54d3e",
  "#f46d43",
  "#fdae61",
  "#fee08b",
  "#e3e35f",
  "#b0d555",
  "#84bb62",
  "#63b859",
  "#2e7d32"
];