import './RoomBar.css';
import SectionForm from '../SectionForm/SectionForm';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import InviteForm from '../InviteForm/InviteForm';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { PROFILE_PICTURES_DIRECTORY } from '../../../models/globalVariables';

export default function RoomBar({ roomInfo }) {
    const {
        activeUsers,
        sidePanel: { setPanel, resetPanel }
    } = useRoomContext();

    const showSectionForm = () => {
        setPanel({
            header:"Create a section",
            content: [<SectionForm key='sectionForm' editMode={false} submitAction={() => resetPanel()}/>],
            actions: [{key:'confirmSection', name:"Confirm", targetForm:'SectionForm'}, {key:'cancelSection',name:'Cancel', function:resetPanel}]
        });
    }

    const showUserInvite = () => {
        setPanel({
            header: "Invite new users",
            content: [<InviteForm key='sectionForm' roomInfo={roomInfo}></InviteForm>],
            actions: [{key:'sendInvite', name:"Invite", targetForm:'InviteForm'}, {key:'cancelInvite',name:'Cancel', function:resetPanel}],
        });
    }

    return (
        <div className="RoomBar">

            <div className='roomOptions'>
                <h2>{roomInfo.name}</h2>
                <button onClick={showSectionForm}>+ Section</button>
                <button>Options</button>
            </div>

            <div className='roomUsers'>
                <div className='hideOnPhone'>Users</div>
                <div className='userList'>
                    <div className='portraits'>
                    {
                        activeUsers.map((data, index) => {
                            console.log("active user:", data);
                            if (index > 2) return;
                            if (data === null) return;
                            return <ProfilePicture pictureName={data.profile_picture}></ProfilePicture>
                        })
                    }
                    </div>
                    <div>

                    </div>
                </div>
                
                <button onClick={showUserInvite}>+</button>
            </div>
        </div>
    );
}