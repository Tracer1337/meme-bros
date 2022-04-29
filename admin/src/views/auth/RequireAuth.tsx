import { Navigate, useLocation } from "react-router-dom"
import { useStore } from "../../lib/store"

function RequireAuth({ children }: { children: JSX.Element }) {
    const isLoggedIn = useStore((state) => state.isLoggedIn)

    const location = useLocation()

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}    
                replace
            />
        )
    }
    
    return <>{children}</>
}

export default RequireAuth
