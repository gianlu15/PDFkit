import LanguageCard from "./LanguageCard";

function LanguageGrid() {
  return (
    <div className="language-grid">
      <LanguageCard title="Italiano" langCode="it" />
      <LanguageCard title="English" langCode="en" />
      <LanguageCard title="Français" langCode="fr" />
      <LanguageCard title="Espanol" langCode="es" />
    </div>
  );
}

export default LanguageGrid;
