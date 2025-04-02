import qs from 'querystring';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL!;
const REALM = process.env.KEYCLOAK_REALM!;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID!;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET!;

interface Token {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

export class AuthSessionManager {
  /**
   * Проверка токена и обновление, если истёк.
   */
  static async ensureValidAccessToken(token: Token): Promise<Token | null> {
    if (Date.now() < token.accessTokenExpires) {
      // accessToken всё ещё валиден
      return token;
    }

    console.log('Access token expired. Attempting to refresh...');
    const refreshed = await this.refreshAccessToken(token.refreshToken);

    if (!refreshed) {
      console.log('Refresh token invalid. Logging out...');
      await this.logoutFromKeycloak(token.refreshToken);
      return null; // Сигнализируем, что пользователь должен быть выкинут
    }

    return refreshed;
  }

  /**
   * Обновление токенов через refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<Token | null> {
    try {
      const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: qs.stringify({
          grant_type: 'refresh_token',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        console.error('Failed to refresh access token');
        return null;
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? refreshToken,
        accessTokenExpires: Date.now() + data.expires_in * 1000,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Выход из Keycloak (убийство серверной сессии)
   */
  static async logoutFromKeycloak(refreshToken: string): Promise<void> {
    try {
      const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: qs.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        console.error('Logout from Keycloak failed');
      } else {
        console.log('User successfully logged out from Keycloak');
      }
    } catch (error) {
      console.error('Error logging out from Keycloak:', error);
    }
  }

  /**
   * Опционально: форсировать redirect с prompt=login
   */
  static getForceLoginUrl(redirectUri: string): string {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      scope: 'openid',
      redirect_uri: redirectUri,
      prompt: 'login',
    });

    return `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth?${params.toString()}`;
  }
}
