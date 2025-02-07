import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../../api/requester";
import { UserContext } from "../../context/UserContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
    
        const data = { email, password };
        const response = await api.login(data);
    
        if (response.ok) {  // Check if response status is in the range 200-299
            const userData = await response.json();
            setUser(userData);
            navigate("/account");
            console.log(userData); 
        } else {
            console.log("Login failed");
            // Optionally, handle login failure (e.g., show an error message)
        }
    };
    
    useEffect(() => {
        const emptyInputs = !email && !password;
        setIsEmpty(emptyInputs);
    }, [email, password]);
    

    return (
        <div className="max-w-global mx-auto flex justify-center mt-20">
            <div className="flex flex-col">
                <h1 className="text-4xl text-center mb-4">Connexion</h1>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md"
                    action="POST"
                >
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <button disabled={isEmpty} className="primary mt-5">
                    Connexion
                    </button>
                </form>
                {/* <div className="text-center mt-4">
                Vous n'avez pas de compte ?{" "}
                    <Link className="font-semibold underline" to={"/register"}>
                    S'inscrire
                    </Link>
                </div> */}
            </div>
        </div>
    );
}

export default Login;