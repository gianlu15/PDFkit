import { useLanguage } from "../../contexts/LanguageContext";
import checkIcon from "../../assets/icon/check.svg";

function LanguageCard({ title, langCode }) {
  const { changeLanguage, language } = useLanguage();

  const handleSelect = () => {
    changeLanguage(langCode);
  };

  return (
    <div className="language-card" onClick={handleSelect}>
      <h4 className="language-title">{title}</h4>
      {language === langCode && (
        <span className="icon">
          <img src={checkIcon} alt="Selected" />
        </span>
      )}
    </div>
  );
}

export default LanguageCard;
