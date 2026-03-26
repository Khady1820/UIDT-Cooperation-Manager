import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topnav from './Topnav';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="bg-surface-50 text-surface-900 antialiased min-h-screen font-sans transition-colors duration-300">
            <Sidebar />
            <Topnav />
            
            <main className="ml-64 pt-16 min-h-screen">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="p-8"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
