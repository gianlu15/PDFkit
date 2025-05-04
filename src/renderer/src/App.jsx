import { useState } from "react";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import MergePage from "./components/operation/MergePage";
import RemovePage from "./components/operation/RemovePage";
import ExtractPage from "./components/operation/ExtractPage";
import LanguagePage from "./components/LanguagePage";

function App() {
    const [currentPage, setCurrentPage] = useState("home");

    const goHome = () => setCurrentPage("home");

    return (
        <>
            <Navbar onSelectOperation={setCurrentPage}/>
            <div className="main-container">
                {currentPage === "home" && <Homepage onSelectOperation={setCurrentPage} />}
                {currentPage === "merge" && <MergePage/>}
                {currentPage === "remove" && <RemovePage/>}
                {currentPage === "extract" && <ExtractPage/>}
                {currentPage === "language" && <LanguagePage/>}
                {/* Qui aggiungerai anche SplitPage, RemovePage, ExtractPage ecc */}
            </div>
        </>
    );
}

export default App;
