import "./FileCard.css";

function FileCard({ file }) {
    if (file.password) return <div></div>;
    return (
        <div className="file-card-container">
            <h3>name: {file.name}</h3>
            <h6>date: {new Date(file.created_at).toDateString()}</h6>
            <p className="temp" >content: {file.content} </p>
        </div>
    );
}

export default FileCard;
