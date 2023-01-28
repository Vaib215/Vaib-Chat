import { Link, Outlet, useLocation } from "react-router-dom"
import { FullScreenCard } from "../../components/FullScreenCard"

export const AuthLayout = () => {
    const location = useLocation()
    const isLoginPage = location.pathname === "/login"
    return <FullScreenCard>
        <FullScreenCard.Body>
            <Outlet />
        </FullScreenCard.Body>
        <FullScreenCard.BelowCard>
            <Link className="link" to={isLoginPage ? '/signup' : '/login'}>
                {isLoginPage ? 'Create an account' : 'Login Instead'}
            </Link>
        </FullScreenCard.BelowCard>
    </FullScreenCard>
}