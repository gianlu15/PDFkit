import { useState } from "react";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import MergePage from "./components/operation/MergePage";
import RemovePage from "./components/operation/RemovePage";
import ExtractPage from "./components/operation/ExtractPage";
import LanguagePage from "./components/LanguagePage";
import SplitPage from "./components/operation/SplitPage";
import WatermarkPage from "./components/operation/WatermarkPage";
import { AnimatePresence, motion } from "framer-motion";


function App() {

    const [currentPage, setCurrentPage] = useState("home");

    const animationVariants = {
        home: {
            initial: { y: "-20%", opacity: 0 },
            animate: { y: "0%", opacity: 1 },
            exit: { y: "-20%", opacity: 0 },
            transition: { duration: 0.5, ease: "easeOut" }
        },
        language: {
            initial: { y: "100%", opacity: 0 },
            animate: { y: "0%", opacity: 1 },
            exit: { y: "50%", opacity: 0 },
            transition: { duration: 0.5, ease: "easeOut" }
        },
        default: {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.2 }

        }
    };

    const pageVariant = animationVariants[currentPage] || animationVariants.default;


    return (
        <>
            <Navbar onSelectOperation={setCurrentPage} />
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
                        {currentPage === "home" && <Homepage onSelectOperation={setCurrentPage} />}
                        {currentPage === "merge" && <MergePage />}
                        {currentPage === "remove" && <RemovePage />}
                        {currentPage === "extract" && <ExtractPage />}
                        {currentPage === "split" && <SplitPage />}
                        {currentPage === "watermark" && <WatermarkPage />}
                        {currentPage === "language" && <LanguagePage />}
                    </motion.div>
                </AnimatePresence>

            </div>
        </>
    );
}

export default App;
