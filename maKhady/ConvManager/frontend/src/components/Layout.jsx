import Sidebar from './Sidebar';
import Topnav from './Topnav';

const Layout = ({ children }) => {
    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen">
            <Sidebar />
            <Topnav />
            
            <main className="ml-64 pt-16 min-h-screen bg-surface">
                {children}
            </main>
        </div>
    );
};

export default Layout;
