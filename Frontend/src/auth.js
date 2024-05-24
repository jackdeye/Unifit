import { useState } from "react";

export function useAuth(authed, setAuthed) {
  console.log("Our Log in state is: " + authed);

  const login = () => {
    // Logic to authenticate the user (e.g., API call, JWT handling)
    console.log("We Be Logging in");
    setAuthed(true);
  };
  const logout = () => {
    // Logic to log out the user
    setAuthed(false);
  };
  return {login, logout };
}
