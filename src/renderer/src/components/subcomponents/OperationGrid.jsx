import { useState, useEffect } from "react";
import OperationCard from "./OperationCard";
import splitIcon from "../../assets/icon/split.svg";
import mergeIcon from "../../assets/icon/merge.svg";
import removeIcon from "../../assets/icon/remove.svg";
import extractIcon from "../../assets/icon/extract.svg";
import { useLanguage } from "../../contexts/LanguageContext";


function OperationGrid({ onSelectOperation }) {

    const { t } = useLanguage();

    const [background, setBackground] = useState("linear-gradient(180deg, rgba(18, 57, 115, 1) 0%, rgba(20, 27, 38, 1) 45%)");

    useEffect(() => {
        document.body.style.background = background;
    }, [background]);

    return (
        <div className="grid">
            <OperationCard 
                title={t('mergeTitle')} 
                desc={t('mergeDesc')} 
                icon={mergeIcon} 
                onClick={() => onSelectOperation('merge')}
                onMouseEnter={() => setBackground("linear-gradient(180deg, rgb(255, 115, 18) 0%, rgba(20, 27, 38, 1) 45%)")}
                onMouseLeave={() => setBackground("linear-gradient(180deg, rgba(18, 57, 115, 1) 0%, rgba(20, 27, 38, 1) 45%)")}
            />
            <OperationCard 
                title={t('splitTitle')} 
                desc={t('splitDesc')} 
                icon={splitIcon} 
                onClick={() => onSelectOperation('split')}
                onMouseEnter={() => setBackground("linear-gradient(180deg, rgb(44, 115, 18) 0%, rgba(20, 27, 38, 1) 45%)")}
                onMouseLeave={() => setBackground("linear-gradient(180deg, rgba(18, 57, 115, 1) 0%, rgba(20, 27, 38, 1) 45%)")}
            />
            <OperationCard 
                title={t('removeTitle')} 
                desc={t('removeDesc')} 
                icon={removeIcon} 
                onClick={() => onSelectOperation('remove')}
                onMouseEnter={() => setBackground("linear-gradient(180deg, rgb(255, 50, 50) 0%, rgba(20, 27, 38, 1) 45%)")}
                onMouseLeave={() => setBackground("linear-gradient(180deg, rgba(18, 57, 115, 1) 0%, rgba(20, 27, 38, 1) 45%)")}
            />
            <OperationCard 
                title={t('extractTitle')} 
                desc={t('extractDesc')}  
                icon={extractIcon} 
                onClick={() => onSelectOperation('extract')}
                onMouseEnter={() => setBackground("linear-gradient(180deg, rgb(115, 18, 115) 0%, rgba(20, 27, 38, 1) 45%)")}
                onMouseLeave={() => setBackground("linear-gradient(180deg, rgba(18, 57, 115, 1) 0%, rgba(20, 27, 38, 1) 45%)")}
            />
        </div>
    )
}

export default OperationGrid;
