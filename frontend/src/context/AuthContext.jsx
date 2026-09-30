import { createContext , useState , useEffect,useContext} from "react";
import {axiosInstance} from "../axiosCalls/axios" ;

const AuthContext = createContext();

// public pages - public routes 
// protected pages - proteccted routes 

// this children is pages which is wrapped by this provider 
const AuthProvider = ({ children }) => {
    // this state will hold the data of logged in user 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const checkAuth = async () => {
        try {
            const response = await axiosInstance.get('/customers/me');
            setUser(response.data.customerData || response.data);
        } catch (error) {
            console.log(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);// all data of auth context 

export { AuthContext, AuthProvider };
