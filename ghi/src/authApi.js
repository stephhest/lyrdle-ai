// import { useEffect, useState, createContext } from "react";

// export const UserContext = createContext();
// let internalToken = null;

// export function getToken() {
//   return internalToken;
// }

// async function getTokenInternal() {
//   const url = `${process.env.REACT_APP_USERS_API_HOST}/token`;
//   try {
//     const response = await fetch(url, {
//       credentials: "include",
//     });
//     if (response.ok) {
//       const data = await response.json();
//       internalToken = data.token;
//       return internalToken;
//     }
//   } catch (e) {}
//   return false;
// }

// export function useToken() {
//   const [token, setToken] = useState(null);
//   useEffect(() => {
//     async function fetchToken() {
//       const token = await getTokenInternal();
//       setToken(token);
//     }
//     if (!token) {
//       fetchToken();
//     }
//   }, [token]);

//   async function logout() {
//     if (token) {
//       const url = `${process.env.REACT_APP_USERS_API_HOST}/token`;
//       await fetch(url, { method: "delete", credentials: "include" });
//       internalToken = null;
//       setToken(null);
//     }
//   }

//   async function login(username, password) {
//     const url = `${process.env.REACT_APP_USERS_API_HOST}/token`;
//     const form = new FormData();
//     form.append("username", username);
//     form.append("password", password);
//     const response = await fetch(url, {
//       method: "post",
//       credentials: "include",
//       body: form,
//     });
//     if (response.ok) {
//       const token = await getTokenInternal();
//       setToken(token);
//       return;
//     }
//     let error = await response.json();
//     return error.detail;
//   }

//   async function signup(username, email, password) {
//     const url = `${process.env.REACT_APP_ACCOUNTS_HOST}/api/users/`;
//     const response = await fetch(url, {
//       credentials: "include",
//       method: "post",
//       body: JSON.stringify({ username, password, email }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.ok) {
//       await login(username, password);
//     }
//     return false;
//   }

//   return [token, login, logout, signup];
// }

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
let internalToken = null;

export function getToken() {
  return internalToken;
}

export async function getTokenInternal() {
  const url = `${process.env.REACT_APP_USERS_API_HOST}/token`;
  try {
    const response = await fetch(url, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      internalToken = data.access_token;
      return internalToken;
    }
  } catch (e) {}
  return false;
}

function handleErrorMessage(error) {
  if ("error" in error) {
    error = error.error;
    try {
      error = JSON.parse(error);
      if ("__all__" in error) {
        error = error.__all__;
      }
    } catch {}
  }
  if (Array.isArray(error)) {
    error = error.join("<br>");
  } else if (typeof error === "object") {
    error = Object.entries(error).reduce(
      (acc, x) => `${acc}<br>${x[0]}: ${x[1]}`,
      ""
    );
  }
  return error;
}

export const AuthContext = createContext({
  token: null,
  setToken: () => null,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export function useToken() {
  const { token, setToken } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchToken() {
      const token = await getTokenInternal();
      setToken(token);
    }
    if (!token) {
      fetchToken();
    }
  }, [setToken, token]);

  async function logout() {
    if (token) {
      const url = `${process.env.REACT_APP_USERS_API_HOST}/token`;
      await fetch(url, { method: "delete", credentials: "include" });
      internalToken = null;
      setToken(null);
      navigate("/");
    }
  }

  async function login(username, password) {
    const url = `${process.env.REACT_APP_USERS_API_HOST}/token`;
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    const response = await fetch(url, {
      method: "post",
      credentials: "include",
      body: form,
    });
    if (response.ok) {
      const token = await getTokenInternal();
      setToken(token);
      return;
    }
    let error = await response.json();
    return handleErrorMessage(error);
  }

  async function signup(username, password, email) {
    const url = `${process.env.REACT_APP_USERS_API_HOST}/api/users`;
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify({
        username,
        password,
        email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      await login(username, password);
    }
    return false;
  }

  async function update(username, password, email) {
    const url = `${process.env.REACT_APP_USERS_API_HOST}/api/users/{user_id}`;
    const response = await fetch(url, {
      method: "put",
      body: JSON.stringify({
        email,
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      await login(username, password);
    }
    return false;
  }

  return [token, login, logout, signup, update];
}
