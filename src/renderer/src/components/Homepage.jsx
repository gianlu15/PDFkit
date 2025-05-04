import OperationGrid from "./subcomponents/OperationGrid";
import Subtitle from "./subcomponents/Subtitle";
import Title from "./subcomponents/Title";
import { useLanguage } from "../contexts/LanguageContext";


function Homepage({ onSelectOperation }) {
    const { t } = useLanguage();

    return (
        <div className="homeContainer">
            <div className="titleContainer">
                <Title text="PDFtool" />
                <Subtitle text={t('subtitleHome')} />
            </div>
            <OperationGrid onSelectOperation={onSelectOperation} />
        </div>
    )
}

export default Homepage;