import { useLanguage } from "../contexts/LanguageContext";

function CreditsPage() {
  const { t } = useLanguage();

  return (
    <div className="credits-page-container">
      <div className="credits-information-container">
        <p>{t('creditsText1')}</p>
        <div className="information-container">
          <p className="credits">Gianluca Tondo</p>
          <p>
            <span
              className="github-link"
              onClick={() => window.api.openExternal('https://github.com/gianlu15')}
            >
              https://github.com/gianlu15
            </span>
          </p>
          <p>{t('creditsText2')} <span className="credits">tondo.gianlu@gmail.com</span></p>
        </div>
      </div>
    </div >
  );
}

export default CreditsPage;
