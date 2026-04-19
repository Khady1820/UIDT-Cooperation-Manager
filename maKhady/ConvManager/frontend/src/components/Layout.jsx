import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topnav from './Topnav';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="bg-transparent text-on-surface antialiased min-h-screen font-sans transition-colors duration-300 overflow-x-hidden">
            <Sidebar />
            <Topnav />
            
            <main className="ml-72 pt-20 min-h-screen">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.98, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -15 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="p-10"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
