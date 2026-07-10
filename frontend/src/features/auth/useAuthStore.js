import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,

    authStatus: "loading",

    setAuthenticated: (user) =>
        set({
            user,
            authStatus: "authenticated",
        }),

    setUnauthenticated: () =>
        set({
            user: null,
            authStatus: "unauthenticated",
        }),
}));

export default useAuthStore;