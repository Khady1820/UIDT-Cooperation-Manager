import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topnav from './Topnav';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex h-screen overflow-hidden bg-transparent text-on-surface antialiased font-sans transition-colors duration-300">
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0 ml-72">
                <Topnav />
                
                <main className="flex-1 overflow-y-auto">
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
        </div>
    );
};

export default Layout;
