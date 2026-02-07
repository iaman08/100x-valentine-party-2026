import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/events" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        Valentine Events
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">
                            Events
                        </Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                                {user.role === "ADMIN" && (
                                    <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <Button variant="ghost" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/auth/signup">
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="border-t py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    <p>© {new Date().getFullYear()} Valentine Events. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
