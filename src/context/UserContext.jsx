import { createContext, useEffect, useState } from "react";
import * as api from "../api/requester"; // Ensure this path is correct

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false); //  Add ready state

    useEffect(() => {
        async function checkUser() {
            try {
                const response = await api.getUser();
                setUser(response);
            } catch {
                setUser(null);
            } finally {
                setReady(true); //  Ensure ready is set after fetching user data
            }
        }
        checkUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
