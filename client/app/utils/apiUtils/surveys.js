const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function fetchSurveyData(publicId) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/surveys/${publicId}`);
    if (!res.ok) {
      throw new Error("Survey not found");
    }
    const { data } = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function submitSurveyResponse(publicId, surveyData) {
  try {
    const res = await fetch(
      `${BACKEND_API_URL}/surveys/${publicId}/responses`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(surveyData),
      }
    );
    if (!res.ok) {
      const { errors } = await res.json();
      throw new Error(errors[0].msg);
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function fetchSurveys(userToken, limit) {
  const res = await fetch(`${BACKEND_API_URL}/surveys?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  const { data } = await res.json();
  return data;
}

export async function fetchSurveyAnalytics(userToken, id) {
  const response = await fetch(`${BACKEND_API_URL}/surveys/${id}/analytics`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  const { data: analytics } = await response.json();
  return analytics;
}

export async function createSurvey(surveyData, userToken) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/surveys`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyData),
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

export async function editSurveyHandler(id, surveyData, userToken) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/surveys/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      throw new Error("Failed to update survey.");
    }

    const { survey: data } = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function publishOrDisableSurveyHandler(
  id,
  sessionToken,
  currentSurvey
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/surveys/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        active: currentSurvey.active ? "false" : "true",
        published: currentSurvey.published ? "false" : "true",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update survey.");
    }

    const { survey: data } = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchStatistics(userToken) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/statistics`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load statistics");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
