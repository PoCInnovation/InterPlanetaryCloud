import UploadButton from "../buttons/UploadButton";
import "./LeftBar.css";

function LeftBar({ email, userDocs, setUserDocs, setFiles }) {
    return (
        <div className="left-bar-container">
            <h4>{email}</h4>
            <UploadButton
                userDocs={userDocs}
                setUserDocs={setUserDocs}
                setFiles={setFiles}
            />
        </div>
    );
}

export default LeftBar;
