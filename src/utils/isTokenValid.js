import jwtDecode from 'jwt-decode'

/**
 * Checks if a token has not expired
 * @param token
 */
export const isTokenValid = (token) => {
  if (!token) {
    return false
  }
  try {
    const decodedJwt = jwtDecode(token)
    return decodedJwt.exp >= Date.now() / 1000
  } catch (e) {
    return false
  }
}
