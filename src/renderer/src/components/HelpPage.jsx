import LanguageGrid from "./subcomponents/LanguageGrid";
import Subtitle from "./subcomponents/Subtitle";
import { useLanguage } from "../contexts/LanguageContext";

function HelpPage() {
  const { t } = useLanguage();

  return (
    <div className="help-container">
      <p>ciaooo</p>
      <p>come vaaa</p>
    </div>
  );
}

export default HelpPage;
