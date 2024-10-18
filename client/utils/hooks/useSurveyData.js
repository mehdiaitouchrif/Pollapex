import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export const useSurveyData = (id, fetchFunction) => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.token) {
        try {
          const result = await fetchFunction(id, session.user.token);
          setData(result);
        } catch (err) {
          setError(err);
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, session, fetchFunction]);

  return { data, error, loading };
};
