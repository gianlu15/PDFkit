import { useState } from 'react';
import Subtitle from '../subcomponents/Subtitle';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Worker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import { useLanguage } from "../../contexts/LanguageContext";


pdfjsLib.GlobalWorkerOptions.workerPort = new Worker();

function RemovePage() {
    const { t } = useLanguage();

    const [selectedFile, setSelectedFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [removeInput, setRemoveInput] = useState('');
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

    const getIntervals = (intervalString) => {
        return intervalString
            .split(',')
            .map(part => {
                const [startStr, endStr] = part.split('-').map(s => s.trim());
                const start = parseInt(startStr);
                const end = endStr ? parseInt(endStr) : start;

                if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
                    throw new Error(`Wrong interval"${part}"`);
                }

                return [start, end];
            });
    };

    const handleRemove = async () => {
        try {
            const intervals = getIntervals(removeInput.trim());
            const success = await window.api.removePDF([selectedFile], intervals);
            setResultMessage(success ? t('removeSuccess') : t('operationError'));
        } catch (err) {
            console.error(err);
            setResultMessage(t('wrongIntervals'));
        }
    };

    return (
        <div className="one-pdf-container">
            <div className="title-container">
                <Subtitle text={t('removeDesc')} />
            </div>
            <div className="select-PDF">
                {selectedFile ? (
                    <div className="file-card">
                        {thumbnail && <img src={thumbnail} alt="PDF Preview"/>}
                        <p className="pdf-name">{selectedFile.split('/').pop()}</p>
                    </div>
                ) : (
                    <button className="select-button" id="select-remove-button" onClick={handleSelectFile}>
                        <span className="button-text">{t('selectPDF')}</span>
                    </button>
                )}
            </div>
            <div className="operation-settings">
                <div className="input-settings">
                    <label className="button-text">{t('removeSettings')}</label>
                    <input
                        className="input-pages"
                        type="text"
                        placeholder="(ex: 1-3, 7, 18-25)"
                        value={removeInput}
                        onChange={(e) => setRemoveInput(e.target.value)}
                    />
                </div>
                <div className="confirm-settings">
                    <button
                        className="confirm-button"
                        id="confirm-remove-button"
                        onClick={handleRemove}
                        disabled={!selectedFile || !removeInput.trim()}
                    >
                        {t('removeButton')}
                    </button>
                    <p className="output-result">{resultMessage}</p>
                </div>
            </div>
        </div>
    );
}

export default RemovePage;