import LanguageGrid from "./subcomponents/LanguageGrid";
import Subtitle from "./subcomponents/Subtitle";
import { useLanguage } from "../contexts/LanguageContext";

function LanguagePage() {
  const { t } = useLanguage();

  return (
    <div className="language-container">
      <div className="title-container">
        <Subtitle text={t('selectLanguage')} />
      </div>
      <LanguageGrid />
    </div>
  );
}

export default LanguagePage;
