import jwt_decode from "jwt-decode";
import { AUTH_TOKEN_NAME } from "./constants";

/**
 * Checks if a token has not expired
 * @param token
 */

export const isTokenValid = (token) => {
  if (!token) {
    return false;
  }
  try {
    const decodedJwt = jwt_decode(token);
    return decodedJwt.exp >= Date.now() / 1000;
  } catch (e) {
    return false;
  }
};

/**
 * Checks if a user is logged in
 */
export const isLoggedIn = () => {
  return isTokenValid(localStorage.getItem(AUTH_TOKEN_NAME));
};
