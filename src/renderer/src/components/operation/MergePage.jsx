import Subtitle from "../subcomponents/Subtitle";

function MergePage(){
    return (
        <div className="mergeContainer">
            <div className="titleContainer">
                <Subtitle text="Select the PDFs you want to merge" />
            </div>
        </div>
    );
}

export default MergePage;