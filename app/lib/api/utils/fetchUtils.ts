import { getAuthData, handleExpiredToken } from '../../auth/storage';

export async function handleHttpErrors(res: Response) {
  // Special case for login endpoint failures
  if (res.url.includes('/auth/login') && !res.ok) {
    const errorResponse = await res.json();
    throw new Error(errorResponse.message || "Fejl ved login");
  }

  // Special case for register endpoint failures
  if (res.url.includes('/auth/register') && !res.ok) {
    const errorResponse = await res.json();
    throw new Error(errorResponse.message || "Fejl ved registrering");
  }

  // Handle expired token for other endpoints
  if (res.status === 401) {
    await handleExpiredToken();
  }

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(errorResponse.error || errorResponse.message || "Der opstod en fejl");
  }
  
  // For DELETE requests or other empty responses
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null;
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function makeOptions(method: string, body: object | null, addToken?: boolean): Promise<RequestInit> {
  const opts: RequestInit = {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  };

  if (body) {
    opts.body = JSON.stringify(body);
  }

  if (addToken) {
    const { token } = await getAuthData();
    if (token) {
      opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` };
    }
  }

  return opts;
}