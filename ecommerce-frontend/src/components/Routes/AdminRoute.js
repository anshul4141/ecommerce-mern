import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
import {environment} from "../../environment.ts"

export default function AdminRoute() {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    const apiUrl = environment.apiUrl;

    useEffect(() => {
        const authCheck = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/auth/admin-auth`);
                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setOk(false);
            }
        };

        if (auth?.token) {
            authCheck();
        }
    }, [auth?.token]);

    // If auth check is successful, render the child components; otherwise, show spinner
    return ok ? <Outlet /> : <Spinner path="" />;
}