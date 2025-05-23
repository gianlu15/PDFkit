import { useLanguage } from "../contexts/LanguageContext";
import HelpCard from "./subcomponents/HelpCard";
import Subtitle from "./subcomponents/Subtitle";

function HelpPage() {
  const { t } = useLanguage();

  return (
    <div className="language-container">
      <div className="title-container">
        <Subtitle text={t('helpSubtitle')} />
      </div>
      <div className="help-section">
        <div className="help-grid">
          <HelpCard title={t('helpTitleWhatIsPDFkit')} paragraph={t('helpParagraphWhatIsPDFkit')} />
          <HelpCard title={t('helpTitleMerge')} paragraph={t('helpParagraphMerge')} />
          <HelpCard title={t('helpTitleSplit')} paragraph={t('helpParagraphSplit')} />
          <HelpCard title={t('helpTitleRemove')} paragraph={t('helpParagraphRemove')} />
          <HelpCard title={t('helpTitleExtract')} paragraph={t('helpParagraphExtract')} />
          <HelpCard title={t('helpTitleWatermark')} paragraph={t('helpParagraphWatermark')} />
          <HelpCard title={t('helpTitleSummarize')} paragraph={t('helpParagraphSummarize')} />
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
