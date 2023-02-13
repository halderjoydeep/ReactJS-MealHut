import { useState, useCallback } from "react";

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (urlConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(urlConfig.url, {
        method: urlConfig.method ? urlConfig.method : "GET",
        body: urlConfig.body ? JSON.stringify(urlConfig.body) : null,
        headers: urlConfig.headers ? urlConfig.headers : {},
      });

      if (!response.ok) {
        throw new Error("Something not right!");
      }

      const jsonData = await response.json();
      applyData(jsonData);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, []);

  return { isLoading, sendRequest, error };
}
export default useHttp;
