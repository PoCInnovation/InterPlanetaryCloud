import FileCard from "../cards/FileCard";
import "./FilesGrid.css";

function FilesGrid({ files }) {
    if (!files) return <div></div>;

    return (
        <div className="files-grid-container">
            <h3>{files.length - 1} files</h3>
            {files.map((file, i) => <FileCard key={i} file={file} /> )}
        </div>
    );
}

export default FilesGrid;
