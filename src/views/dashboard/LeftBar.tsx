import UploadButton from "../../app/components/buttons/UploadButton";
import "./LeftBar.css";

export type LeftBarProps = {
    email: string,
    userDocs: any,
    setUserDocs: React.Dispatch<any>,
    setFiles: React.Dispatch<any>,
};

const LeftBar: React.FC<LeftBarProps> = props => {
    return (
        <div className="left-bar-container">
            <h4>{props.email}</h4>
            <UploadButton
                userDocs={props.userDocs}
                setUserDocs={props.setUserDocs}
                setFiles={props.setFiles}
            />
        </div>
    );
}

export default LeftBar;
