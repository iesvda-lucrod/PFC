import ProfilePicture from "../../../../../../components/ProfilePicture/ProfilePicture";
import "./MemberCard.css";

export default function MemberCard({ memberInfo, kickUser, showKickButton }) {
    return (
        <div className="MemberCard">
            <div className="info">
                <p><b>{memberInfo.username}</b></p>
                <ProfilePicture pictureName={memberInfo.profile_picture}></ProfilePicture>
                <p><b>{memberInfo.email}</b> </p>   
            </div>
           
            {
                (showKickButton && memberInfo.role != 'owner') && 
                <button onClick={() => kickUser(memberInfo.id)}>Kick</button>
            }
        </div>
    );
}