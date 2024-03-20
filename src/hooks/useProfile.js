import { useState, useEffect } from "react";
import * as userAPINew from "@/apisNew/user";
export const useProfile = () => {
  const [users, setusers] = useState(null);

  const fetchProfile = async () => {
      const result = await userAPINew.getProfile();
      setusers(result);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { users , fetchProfile };
};
