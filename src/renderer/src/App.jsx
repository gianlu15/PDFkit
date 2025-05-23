import { useState } from "react";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import MergePage from "./components/operation/MergePage";
import RemovePage from "./components/operation/RemovePage";
import ExtractPage from "./components/operation/ExtractPage";
import LanguagePage from "./components/LanguagePage";
import SplitPage from "./components/operation/SplitPage";
import WatermarkPage from "./components/operation/WatermarkPage";
import SummaryPage from "./components/operation/SummaryPage";
import HelpPage from "./components/HelpPage";
import CreditsPage from "./components/CreditsPage";
import { AnimatePresence, motion } from "framer-motion";


function App() {

    const [currentPage, setCurrentPage] = useState("home");
    const [previousPage, setPreviousPage] = useState(null);
    const pageOrder = ['home', 'help', 'language', 'credits'];


    const handlePageChange = (nextPage) => {
        setPreviousPage(currentPage);
        setCurrentPage(nextPage);
    };

    const getPageDirection = (from, to) => {
        const fromIndex = pageOrder.indexOf(from);
        const toIndex = pageOrder.indexOf(to);

        if (fromIndex === -1 || toIndex === -1) return 'default';

        return fromIndex < toIndex ? 'down' : 'up';
    };

    const animationVariants = {
        down: {
            initial: { y: '100%', opacity: 0 },
            animate: { y: '0%', opacity: 1 },
            exit: { y: '50%', opacity: 0 },
            transition: { duration: 0.5, ease: 'easeOut' }
        },
        up: {
            initial: { y: '-100%', opacity: 0 },
            animate: { y: '0%', opacity: 1 },
            exit: { y: '-50%', opacity: 0 },
            transition: { duration: 0.5, ease: 'easeOut' }
        },
        default: {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            transition: { duration: 0.3, ease: 'easeOut' }
        }
    };

    const direction = getPageDirection(previousPage, currentPage);
    const pageVariant = animationVariants[direction] || animationVariants.default;

    return (
        <>
            <Navbar onSelectOperation={handlePageChange}
            />
            <div className="main-container">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={pageVariant.initial}
                        animate={pageVariant.animate}
                        exit={pageVariant.exit}
                        transition={pageVariant.transition}
                        className="page-wrapper"
                    >
                        {currentPage === "home" && <Homepage onSelectOperation={handlePageChange}
                        />}
                        {currentPage === "merge" && <MergePage onBack={() => handlePageChange("home")} />}
                        {currentPage === "remove" && <RemovePage onBack={() => handlePageChange("home")} />}
                        {currentPage === "extract" && <ExtractPage onBack={() => handlePageChange("home")} />}
                        {currentPage === "split" && <SplitPage onBack={() => handlePageChange("home")}/>}
                        {currentPage === "watermark" && <WatermarkPage onBack={() => handlePageChange("home")}/>}
                        {currentPage === "summary" && <SummaryPage onBack={() => handlePageChange("home")}/>}
                        {currentPage === "help" && <HelpPage />}
                        {currentPage === "language" && <LanguagePage />}
                        {currentPage === "credits" && <CreditsPage />}
                    </motion.div>
                </AnimatePresence>

            </div>
        </>
    );
}

export default App;
