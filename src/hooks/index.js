import axios from "axios";
import { AuthenticationContext } from "contexts/auth-context";
import { useEffect, useState, useContext, useCallback } from "react";

export const useGetApiRequest = (url) => {
  const { user } = useContext(AuthenticationContext);
  const config = {
    headers: {
      Authorization: user && user.data && user.data.token,
    },
  };
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(url, config)
        .then((response) => {
          setIsLoaded(true);
          setData(response.data);
        })
        .catch((error) => {
          setError(error);
        });
    };
    fetchData();
  }, [url, config]);

  return { error, isLoaded, data };
};

export const usePostApiRequest = ({ url, payload }) => {
  const { user } = useContext(AuthenticationContext);
  const headers = {
    headers: {
      Authorization: user && user.data && user.data.token,
      ContentType: "application/json",
    },
  };
  const [res, setRes] = useState({ data: null, error: null, isLoading: false });
  const [error, setError] = useState(null);
  console.log("usePostApiRequest -> setError", setError);
  console.log("usePostApiRequest -> error", error);
  // You POST method here
  const callAPI = useCallback(() => {
    setRes((prevState) => ({ ...prevState, isLoading: true }));
    axios
      .post(url, headers, payload)
      .then((res) => {
        setRes({ data: res.data, isLoading: false, error: null });
      })
      .catch((error) => {
        console.log("callAPI -> error", error);
        setRes({ data: null, isLoading: false, error });
      });
  }, [url, headers, payload]);
  return [res, callAPI];
};
