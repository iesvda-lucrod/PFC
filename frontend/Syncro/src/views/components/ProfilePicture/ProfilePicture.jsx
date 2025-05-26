import "./ProfilePicture.css";
import { PROFILE_PICTURES_DIRECTORY } from "../../../models/globalVariables";

export default function ProfilePicture({ pictureName }) {

    return (
        <div className="ProfilePicture">
            <img src={PROFILE_PICTURES_DIRECTORY+pictureName} alt="Profile picture"/>
        </div>
    );
}