const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function deleteQuestionHandler(questionId, userToken) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
}

export async function updateQuestionHandler(
  questionId,
  userToken,
  updatedQuestion
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/questions/${questionId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuestion),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchSingleQuestion(questionId) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/questions/${questionId}`);

    if (response.ok) {
      const { data } = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch question data.");
    }
  } catch (error) {
    throw error;
  }
}

export async function addQuestionHandler(questionData, surveyId, userToken) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/questions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...questionData, surveyId }),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}
