import { getAuthData, handleExpiredToken } from '../../auth/storage';

export async function handleHttpErrors(res: Response) {
  // If the response is 401, handle the expired token (by clearing the token and redirecting to the login page)
  if (res.status === 401) {
    await handleExpiredToken();
  }

  if (!res.ok) {
    const errorResponse = await res.json();
    // Use the error message from the backend, or fallback to a generic message
    throw new Error(errorResponse.error || errorResponse.message || "Fejl ved login");
  }
  return res.json();
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