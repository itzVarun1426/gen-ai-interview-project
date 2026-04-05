import { useContext,useEffect } from "react";
import { authContext} from "../Auth.context.jsx";
import { login,register , logout , getMe } from "../services/auth.api.js";

export const useAuth = ()=>{

    const context = useContext(authContext);
     if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    const {user , setUser , loading , setLoading} = context;

    const handleLogin=async({email,password})=>{
        try {
            setLoading(true)
            const data = await login({email,password});
            setUser(data.user)
            setLoading(false)
        } catch (err) {
            console.log("error while handling login",err);
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async({username, email,password})=>{
        try{
            setLoading(true);
            const data = await register({username,email,password});
            setUser(data.user);
        }
        catch(err){
            console.log("error while handling registration",err);
        }finally{
            setLoading(false)
        }
    }

    const handleLogout = async ()=>{
        try{
            setLoading(true);
            const data = await logout();
            setUser(null);
        }
        catch(err){
            console.log("error while handling logout",err);
        }  finally{
            setLoading(false)
        }
    }

    useEffect(() => {
    const fetchUser = async () => {
        try {
            const data = await getMe();
            console.log(data);
            setUser(data?.user || null);
        } catch (err) {
            console.log("error fetching user", err);
            setUser(null);
        } finally {
            setLoading(false); // 🔥 THIS WAS MISSING
        }
    };

    fetchUser();
}, []);

    return {user , loading , handleLogin,handleRegister,handleLogout}

}