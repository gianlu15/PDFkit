import LanguageGrid from "./subcomponents/LanguageGrid";
import Subtitle from "./subcomponents/Subtitle";
import { useLanguage } from "../contexts/LanguageContext";

function CreditsPage() {
  const { t } = useLanguage();

  return (
    <div className="help-container">
      <p>ciaooo</p>
      <p>casasfasdas</p>
    </div>
  );
}

export default CreditsPage;
