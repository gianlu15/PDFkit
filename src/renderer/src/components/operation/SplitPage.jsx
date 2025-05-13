import { useState } from 'react';
import Subtitle from '../subcomponents/Subtitle';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Worker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import { useLanguage } from "../../contexts/LanguageContext";


pdfjsLib.GlobalWorkerOptions.workerPort = new Worker();

function SplitPage() {
    const { t } = useLanguage();

    const [selectedFile, setSelectedFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [splitInput, setsplitInput] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [splitType, setSplitType] = useState('custom');

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

    const handlesplit = async () => {
        if (!selectedFile || !splitInput.trim()) return;

        try {
            let success = false;

            if (splitType === 'custom') {
                const intervals = getIntervals(splitInput.trim());
                success = await window.api.splitPersonalizedPDF([selectedFile], intervals);
            } else if (splitType === 'fixed') {
                const trimmed = splitInput.trim();
                if (!/^\d+$/.test(trimmed)) {
                    setResultMessage(t('wrongIntervals'));
                    return;
                }
                const fixed = parseInt(trimmed);
                if (fixed < 1) {
                    setResultMessage(t('wrongIntervals'));
                    return;
                }
                success = await window.api.splitFixedPDF([selectedFile], fixed);
            }

            setResultMessage(success ? t('splitSuccess') : t('operationError'));
        } catch (err) {
            console.error(err);
            setResultMessage(t('wrongIntervals'));
        }
    };


    return (
        <div className="one-pdf-container">
            <div className="title-container">
                <Subtitle text={t('splitDesc')} />
            </div>
            <div className="split-select-PDF">
                {selectedFile ? (
                    <div className="file-card">
                        {thumbnail && <img src={thumbnail} alt="PDF Preview" />}
                        <p className="pdf-name">{selectedFile.split('/').pop()}</p>
                    </div>
                ) : (
                    <button className="select-button" id="select-split-button" onClick={handleSelectFile}>
                        <span className="button-text">{t('selectPDF')}</span>
                    </button>
                )}
            </div>
            <div className="split-operation-settings">
                <div className="split-input-interval-settings">
                    <div className="split-select-interval-type">
                        <div className="split-select-interval-type">
                            <span
                                className={`split-interval-type ${splitType === 'fixed' ? 'active' : ''}`} id='split-interval-type-one'
                                onClick={() => setSplitType('custom')}
                            >
                                {t('splitCustomInterval')}
                            </span>
                            <span
                                className={`split-interval-type ${splitType === 'custom' ? 'active' : ''}`} id='split-interval-type-two'
                                onClick={() => setSplitType('fixed')}
                            >
                                {t('splitFixedInterval')}
                            </span>
                        </div>

                    </div>
                    <div>
                        <label className="button-text">{t('splitSettings')}</label>
                        <input
                            className="input-pages"
                            type="text"
                            placeholder={splitType === 'fixed' ? '(ex. 2)' : '(ex: 1-3, 7, 18-25)'}
                            value={splitInput}
                            onChange={(e) => setsplitInput(e.target.value)}
                        />
                    </div>
                </div>
                <div className="confirm-settings">
                    <button
                        className="confirm-button"
                        id="confirm-split-button"
                        onClick={handlesplit}
                        disabled={!selectedFile || !splitInput.trim()}
                    >
                        {t('splitButton')}
                    </button>
                    <p className="output-result">{resultMessage}</p>
                </div>
            </div>
        </div>
    );
}

export default SplitPage;