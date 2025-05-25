import { useState } from 'react';
import Subtitle from '../subcomponents/Subtitle';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Worker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import backIcon from "../../assets/icon/back.svg";
import { useLanguage } from "../../contexts/LanguageContext";


pdfjsLib.GlobalWorkerOptions.workerPort = new Worker();

function MergePage({ onBack }) {
    const { t } = useLanguage();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [filenameInput, setFilenameInput] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const handleSelectFile = async () => {
        try {
            const files = await window.api.selectPDFs();

            // Evita file duplicati
            const newFiles = files.filter(f => !selectedFiles.includes(f));
            if (selectedFiles.length + newFiles.length > 10) {
                setResultMessage(t('mergeMaxError'));
                return;
            }
            const updatedFiles = [...selectedFiles, ...newFiles];
            const newThumbnails = [...thumbnails];

            for (const filePath of newFiles) {
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
                newThumbnails.push(thumbnailDataUrl);
            }

            setSelectedFiles(updatedFiles);
            setThumbnails(newThumbnails);
        } catch (error) {
            setResultMessage('Error during uploading');
        }
    };

    const handleMerge = async () => {
        const exportPath = localStorage.getItem('exportPath');
        if (!exportPath) {
            setResultMessage('Devi prima scegliere una cartella di esportazione dalle impostazioni.');
            return;
        }
        try {
            const success = await window.api.mergePDFs(selectedFiles, filenameInput, exportPath);
            setResultMessage(success ? t('mergeSuccess') : t('operationError'));
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
                <Subtitle text={t('mergeDesc')} />
            </div>
            <div className={`select-multiple-PDF ${selectedFiles.length > 0 ? 'active' : ''}`}>
                {selectedFiles.length > 0 ? (
                    <>
                        {selectedFiles.map((file, index) => (
                            <div key={file} className='file-card-component'>
                                <div className="merge-file-card">
                                    {thumbnails[index] && <img src={thumbnails[index]} alt="PDF Preview" />}
                                    <p className="merge-pdf-name">{file.split('/').pop()}</p>
                                </div>
                                <span>{index + 1}</span>
                            </div>
                        ))}

                        {selectedFiles.length < 10 && (
                            <div className='file-card-component'>
                                <button className="add-button" id="select-merge-button" onClick={handleSelectFile}>
                                    <span className="button-text">+</span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <button className="select-button" id="select-merge-button" onClick={handleSelectFile}>
                        <span className="button-text">{t('selectPDF')}</span>
                    </button>
                )}
            </div>


            <div className="merge-settings">
                <div className="input-settings">
                    <label className="button-text">{t('mergeSettings')}</label>
                    <input
                        className="input-pages"
                        type="text"
                        placeholder=""
                        value={filenameInput}
                        onChange={(e) => setFilenameInput(e.target.value)}
                    />
                </div>
                <div className="confirm-settings">
                    <button
                        className="confirm-button"
                        id="confirm-merge-button"
                        onClick={handleMerge}
                        disabled={selectedFiles.length == 0 || !filenameInput.trim()}
                    >
                        {t('mergeButton')}
                    </button>
                    <p className="output-result">{resultMessage}</p>
                </div>
            </div>
        </div>
    );
}

export default MergePage;