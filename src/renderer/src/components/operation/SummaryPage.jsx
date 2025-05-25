import { useState } from 'react';
import Subtitle from '../subcomponents/Subtitle';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Worker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import backIcon from "../../assets/icon/back.svg";
import { useLanguage } from "../../contexts/LanguageContext";


pdfjsLib.GlobalWorkerOptions.workerPort = new Worker();

function SummaryPage({ onBack }) {
    const { t } = useLanguage();

    const [selectedFile, setSelectedFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
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

    const handleSummary = async () => {
        const exportPath = localStorage.getItem('exportPath');
        if (!exportPath) {
            setResultMessage('Devi prima scegliere una cartella di esportazione dalle impostazioni.');
            return;
        }
        try {
            const success = await window.api.summaryPDF([selectedFile], t('activeLanguage'), exportPath);
            setResultMessage(success ? t('summarySuccess') : t('operationError'));
        } catch (err) {
            console.error(err);
            setResultMessage(t('wrongIntervals'));
        }
    };

    return (
        <div className="one-pdf-container">
            <div className="title-container">
                <span className="back-icon" onClick={onBack}>
                    <img src={backIcon} alt="Back" />
                </span>
                <Subtitle text={t('summaryDesc')} />
            </div>
            <div className="select-PDF">
                {selectedFile ? (
                    <div className="file-card">
                        {thumbnail && <img src={thumbnail} alt="PDF Preview" />}
                        <p className="pdf-name">{selectedFile.split('/').pop()}</p>
                    </div>
                ) : (
                    <button className="select-button" id="select-summary-button" onClick={handleSelectFile}>
                        <span className="button-text">{t('selectPDF')}</span>
                    </button>
                )}
            </div>
            <div className="operation-settings">
                <div className="input-settings">
                    <p>{t('summaryNote')}</p>
                </div>
                <div className="confirm-settings">
                    <button
                        className="confirm-button"
                        id="confirm-summary-button"
                        onClick={handleSummary}
                        disabled={!selectedFile}
                    >
                        {t('summaryButton')}
                    </button>
                    <p className="output-result">{resultMessage}</p>
                </div>
            </div>
        </div>
    );
}

export default SummaryPage;
