import { useState, useEffect } from "react";
import Subtitle from "./subcomponents/Subtitle";
import { useLanguage } from "../contexts/LanguageContext";

function SettingsPage() {
  const { t } = useLanguage();
  const [folderPath, setFolderPath] = useState('');

  useEffect(() => {
    const savedPath = localStorage.getItem('exportPath');
    if (savedPath) setFolderPath(savedPath);
  }, []);

  const handleSelectFolder = async () => {
    const path = await window.api.selectFolder();
    if (path) {
      setFolderPath(path);
      localStorage.setItem('exportPath', path);
    }
  };

  return (
    <div className="language-container">
      <div className="title-container">
        <Subtitle text={t('settingsTitle')} />
      </div>
      <div className="settings-section">
        <div className="settings-card">
          <h4>{t('settingsSelectFolder')}</h4>
          {!folderPath ? (
            <button className="settings-button" onClick={handleSelectFolder}>
              {t('settingsButtonSelect')}
            </button>
          ) : (
            <div className="select-folder-container">
              <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "#ddd" }}>
                {t('settingsCurrentFolder')} <br /> <code>{folderPath}</code>
              </p>
              <button className="settings-button" onClick={handleSelectFolder}>
                {t('settingsButtonChange')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
