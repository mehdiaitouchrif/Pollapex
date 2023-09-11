const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function forgotPassword(email) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(resettoken, password) {
  try {
    const res = await fetch(
      `${BACKEND_API_URL}/auth/resetpassword/${resettoken}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}
