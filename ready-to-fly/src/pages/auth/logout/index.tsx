"use client"
import {useEffect} from "react";
import auth from "@/services/auth.service";
import {useRouter} from "next/navigation";

const Logout = () => {
    const router = useRouter();
    useEffect(() => {
        localStorage.removeItem("Token");
        router.push("../../");
    }, []);
};

export default Logout;
