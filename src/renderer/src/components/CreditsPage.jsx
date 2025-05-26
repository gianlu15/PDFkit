import { useLanguage } from "../contexts/LanguageContext";

function CreditsPage() {
  const { t } = useLanguage();

  return (
    <div className="credits-page-container">
      <div className="credits-information-container">
        <p>Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the "Software"), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions: <br></br>

          The above copyright notice and this permission notice shall be included in all
          copies or substantial portions of the Software.</p>
        <p>PDFkit Copyright (c) 2025</p>
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
