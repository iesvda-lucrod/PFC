import ProfilePicture from "../ProfilePicture/ProfilePicture";
import "./MemberCard.css";

export default function MemberCard({ memberInfo, kickUser, showKickButton }) {
    return (
        <div className="MemberCard">
            <div>
                <p>Username: {memberInfo.username}</p>
                <p>Email: {memberInfo.email}</p>
            </div>

            <ProfilePicture pictureName={memberInfo.profile_picture}></ProfilePicture>
            {
                (showKickButton && memberInfo.role != 'owner') && <button onClick={() => kickUser(memberInfo.id)}>Kick</button>
            }
        </div>
    );
}