export async function fetchSurveyData(publicId) {
  try {
    const res = await fetch(`http://localhost:5000/api/surveys/${publicId}`);
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
      `http://localhost:5000/api/surveys/${publicId}/responses`,
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
