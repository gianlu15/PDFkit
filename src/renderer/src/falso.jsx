import { useState } from 'react';

function falso() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [mergeOutputName, setMergeOutputName] = useState('');
  const [splitIntervalsInput, setSplitIntervalsInput] = useState('');
  const [splitFixedIntervalInput, setSplitFixedIntervalInput] = useState('');
  const [extractionIntervalsInput, setExtractionIntervalsInput] = useState('');
  const [removeIntervalsInput, setRemoveIntervalsInput] = useState('');

  const selectFiles = async () => {
    const files = await window.api.selectPDFs();
    setSelectedFiles(files);
    setResultMessage(files.length > 0 ? `${files.length} file selezionati.` : 'Nessun file selezionato.');
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert('Seleziona almeno due PDF da unire.');
      return;
    }
    const fileName = mergeOutputName.trim() || 'merged';
    const success = await window.api.mergePDFs(selectedFiles, fileName);
    setResultMessage(success ? 'PDF uniti! Salvato sul Desktop.' : 'Errore durante l’unione dei PDF.');
  };

  const handleSplit = async () => {
    if (selectedFiles.length !== 1) {
      alert('Selezionare solo un PDF da dividere.');
      return;
    }
    const intervals = getIntervals(splitIntervalsInput.trim());
    const success = await window.api.splitPDF(selectedFiles, intervals);
    setResultMessage(success ? 'PDF diviso! Salvato sul Desktop.' : 'Errore durante la divisione.');
  };

  const handleSplitFixed = async () => {
    if (selectedFiles.length !== 1) {
      alert('Selezionare solo un PDF da dividere.');
      return;
    }
    const interval = parseInt(splitFixedIntervalInput.trim());
    const success = await window.api.splitIntervalPDF(selectedFiles, interval);
    setResultMessage(success ? 'PDF diviso! Salvato sul Desktop.' : 'Errore durante la divisione.');
  };

  const handleExtraction = async () => {
    if (selectedFiles.length !== 1) {
      alert('Selezionare solo un PDF da cui estrarre.');
      return;
    }
    const intervals = getIntervals(extractionIntervalsInput.trim());
    const success = await window.api.extractionPDF(selectedFiles, intervals);
    setResultMessage(success ? 'PDF estratto! Salvato sul Desktop.' : 'Errore durante l’estrazione.');
  };

  const handleRemove = async () => {
    if (selectedFiles.length !== 1) {
      alert('Selezionare solo un PDF da cui rimuovere.');
      return;
    }
    const intervals = getIntervals(removeIntervalsInput.trim());
    const success = await window.api.removePDF(selectedFiles, intervals);
    setResultMessage(success ? 'Pagine rimosse! Salvato sul Desktop.' : 'Errore durante la rimozione.');
  };

  function getIntervals(intervalString) {
    return intervalString
      .split(',')
      .map(part => {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr);
        const end = endStr ? parseInt(endStr) : start;

        if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
          throw new Error(`Intervallo non valido: "${part}"`);
        }

        return [start, end];
      });
  }

  return (
    <div>
      <h1>Unisci più PDF</h1>

      <div>
        <button onClick={selectFiles}>Seleziona PDF</button>
        <p>{resultMessage}</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Nome file unito"
          value={mergeOutputName}
          onChange={(e) => setMergeOutputName(e.target.value)}
        />
        <button onClick={handleMerge}>Unisci PDF</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Intervalli (es: 1-3,5,8-10)"
          value={splitIntervalsInput}
          onChange={(e) => setSplitIntervalsInput(e.target.value)}
        />
        <button onClick={handleSplit}>Dividi PDF</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Intervallo fisso es: 2, 5, 7"
          value={splitFixedIntervalInput}
          onChange={(e) => setSplitFixedIntervalInput(e.target.value)}
        />
        <button onClick={handleSplitFixed}>Dividi PDF in intervalli fissi</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Intervalli (es: 1-3,5,8-10)"
          value={extractionIntervalsInput}
          onChange={(e) => setExtractionIntervalsInput(e.target.value)}
        />
        <button onClick={handleExtraction}>Estrai pagine</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Intervalli (es: 1-3,5,8-10)"
          value={removeIntervalsInput}
          onChange={(e) => setRemoveIntervalsInput(e.target.value)}
        />
        <button onClick={handleRemove}>Rimuovi pagine</button>
      </div>
    </div>
  );
}

export default falso;
