import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("authToken");
      setLoggedIn(!!token);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  return loggedIn ? <Redirect href="/admin/dashboard" /> : <Redirect href="/authentication/login" />;
}
