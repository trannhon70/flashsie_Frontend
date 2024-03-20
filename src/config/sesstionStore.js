export const SessionStore = {
  getUserSession: () => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const userSession = window.sessionStorage.getItem("user");
      return userSession ? JSON.parse(userSession) : null;
    }
    return null;
  },
  setUserSession: (data) => {
    sessionStorage?.setItem("user", JSON.stringify(data));
  },
};
