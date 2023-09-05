const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function fetchResponses(userToken, limit) {
  const res = await fetch(`${BACKEND_API_URL}/responses?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  const { data } = await res.json();
  return data;
}

export async function fetchResponse(id, userToken) {
  const response = await fetch(`${BACKEND_API_URL}/responses/${id}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  const { data } = await response.json();
  return data;
}

export async function fetchSurveyResponses(id, userToken) {
  const response = await fetch(
    `http://localhost:5000/api/surveys/${id}/responses`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  const { data: responses } = await response.json();
  return responses;
}

export const exportResponsesToExcel = async (surveyId, userToken) => {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/surveys/${surveyId}/responses/export`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.blob();
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
