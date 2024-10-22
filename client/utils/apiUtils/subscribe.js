const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const addSubscriber = async (email) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred. Please try again.");
  }
};

export { addSubscriber };
