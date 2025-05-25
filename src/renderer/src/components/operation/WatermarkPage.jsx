import { useState } from 'react';
import Subtitle from '../subcomponents/Subtitle';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Worker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import backIcon from "../../assets/icon/back.svg";
import { useLanguage } from "../../contexts/LanguageContext";


pdfjsLib.GlobalWorkerOptions.workerPort = new Worker();

function WatermarkPage({ onBack }) {
    const { t } = useLanguage();

    const [selectedFile, setSelectedFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [text, setTextWatermark] = useState('');
    const [opacity, setOpacity] = useState(30);
    const [rotation, setRotation] = useState(45);
    const [size, setSize] = useState("normal");
    const [postion, setPosition] = useState("center");

    const [resultMessage, setResultMessage] = useState('');

    const handleSelectFile = async () => {
        try {
            const files = await window.api.selectPDFs();
            if (files.length > 0) {
                const filePath = files[0];
                setSelectedFile(filePath);

                const arrayBuffer = await window.api.readFileAsArrayBuffer(filePath);
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.5 });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;

                const thumbnailDataUrl = canvas.toDataURL('image/png');
                setThumbnail(thumbnailDataUrl);
            }
        } catch (error) {
            setResultMessage('Error during uploading');
        }
    };

    const handleRotationChange = (e) => {
        const inputValue = e.target.value;

        if (inputValue === "") {
            setRotation(0)
            return;
        }

        const parsed = parseInt(inputValue, 10);

        if (!isNaN(parsed) && parsed >= 0 && parsed <= 360) {
            setRotation(parsed);
        }
    };


    const handleWatermark = async () => {
        const exportPath = localStorage.getItem('exportPath');
        if (!exportPath) {
            setResultMessage('Devi prima scegliere una cartella di esportazione dalle impostazioni.');
            return;
        }
        try {
            const success = await window.api.watermarkPDF([selectedFile], text, opacity, postion, rotation, size, exportPath);
            setResultMessage(success ? t('watermarkSucces') : t('operationError'));
        } catch (err) {
            console.error(err);
            setResultMessage(t('operationError'));
        }
    };

    return (
        <div className="one-pdf-container">
            <div className="title-container">
                <span className="back-icon" onClick={onBack}>
                    <img src={backIcon} alt="Back" />
                </span>
                <Subtitle text={t('watermarkDesc')} />
            </div>
            <div className="select-PDF">
                {selectedFile ? (
                    <div className="file-card">
                        {thumbnail && <img src={thumbnail} alt="PDF Preview" />}
                        <p className="pdf-name">{selectedFile.split('/').pop()}</p>
                    </div>
                ) : (
                    <button className="select-button" id="select-watermark-button" onClick={handleSelectFile}>
                        <span className="button-text">{t('selectPDF')}</span>
                    </button>
                )}
            </div>

            <div className="operation-settings">
                <div className='scrollable-settings'>
                    <div className="input-settings">
                        <label className="button-text">{t('watermarkSettings')}</label>
                        <input
                            className="input-pages"
                            type="text"
                            maxLength={10}
                            placeholder="(ex. FACSIMILE)"
                            value={text}
                            onChange={(e) => setTextWatermark(e.target.value)}
                        />
                    </div>
                    <div className="input-settings">
                        <label className="button-text">{t('watermarkOpacity')} </label>
                        <input type="range" min="1" max="100" className='slider' value={opacity}
                            onChange={(e) => setOpacity(Number(e.target.value))} />
                    </div>
                    <div className="input-settings">
                        <label className="button-text">{t('watermarkRotation')}</label>
                        <select value={rotation} onChange={(e) => setRotation(Number(e.target.value))}>
                            <option value={0}>0°</option>
                            <option value={45}>45°</option>
                            <option value={90}>90°</option>
                            <option value={180}>180°</option>
                        </select>
                    </div>
                    <div className="input-settings">
                        <label className="button-text">{t('watermarkPosition')}</label>
                        <select value={postion} onChange={(e) => setPosition(e.target.value)}>
                            <option value="center">{t('watermarkCenter')}</option>
                            <option value="top-right">{t('watermarkTopRight')}</option>
                            <option value="top-left">{t('watermarkTopLeft')}</option>
                            <option value="bottom-right">{t('watermarkBottomRight')}</option>
                            <option value="bottom-left">{t('watermarkBottomLeft')}</option>
                        </select>
                    </div>
                    <div className="input-settings">
                        <label className="button-text">{t('watermarkSize')}</label>
                        <select value={size} onChange={(e) => setSize(e.target.value)}>
                            <option value="small">{t('watermarkSmall')}</option>
                            <option value="normal">{t('watermarkNormal')}</option>
                            <option value="big">{t('watermarkBig')}</option>
                        </select>
                    </div>
                </div>
                <div className="confirm-settings">
                    <button
                        className="confirm-button"
                        id="confirm-watermark-button"
                        onClick={handleWatermark}
                        disabled={!selectedFile || !text.trim()}
                    >
                        {t('watermarkButton')}
                    </button>
                    <p className="output-result">{resultMessage}</p>
                </div>
            </div>
        </div>
    );
}

export default WatermarkPage;
