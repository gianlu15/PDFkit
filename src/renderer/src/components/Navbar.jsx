import homeIcone from "../assets/icon/pdfHome.svg";
import helpIcone from "../assets/icon/help.svg";
import languageIcone from "../assets/icon/language.svg";
import creditIcone from "../assets/icon/credits.svg";
import { useLanguage } from "../contexts/LanguageContext";



function Navbar({onSelectOperation}) {
    const { t } = useLanguage();
    return (
        <ul className="navbar">
            <li>
                <a href="#" onClick={() => onSelectOperation('home')}>
                    <img className="navIcon" src={homeIcone} />
                    <span className="nameIcon">Home</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <img className="navIcon" src={helpIcone} />
                    <span className="nameIcon">{t('navbarHelp')}</span>
                </a>
            </li>
            <li>
                <a href="#" onClick={() => onSelectOperation('language')}>
                    <img className="navIcon" src={languageIcone} />
                    <span className="nameIcon">{t('navbarLanguage')}</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <img className="navIcon" src={creditIcone} />
                    <span className="nameIcon">{t('navbarCredits')}</span>
                </a>
            </li>
        </ul>
    )

}

export default Navbar;