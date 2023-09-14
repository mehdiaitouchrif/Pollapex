const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function getUser(userToken) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateDetails(userToken, details) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/updatedetails`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(details),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function changePassword(userToken, newPassword) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/updatepassword`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAccount(userToken) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

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
