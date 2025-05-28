import './RoomBar.css';
import SectionForm from '../SectionForm/SectionForm';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import InviteForm from '../InviteForm/InviteForm';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { Icon_three_dots } from '../../../assets/icons';
import MemberCard from '../MemberCard/MemberCard';

export default function RoomBar({ roomInfo, role }) {
    const {
        activeUsers,
        room: { roomIsLoading, roomModel },
        sidePanel: { setPanel, resetPanel }
    } = useRoomContext();

    const showSectionForm = () => {
        setPanel({
            header:"Create a section",
            content: [<SectionForm key='sectionForm' editMode={false}/>],
            actions: [{key:'confirmSection', name:"Confirm", targetForm:'SectionForm'}, {key:'cancelSection',name:'Cancel', function:resetPanel}]
        });
    }

    const showUserList = () => {

        const activeIds = activeUsers.map((data)=> {return data.user});
        setPanel({
            header: 'Members',
            content: roomInfo.members.map((member) => {

                return <MemberCard key={member.id} memberInfo={member} kickUser={kickUser} active={activeIds.includes(member.id)} showKickButton={(role != 'member')}></MemberCard>
            }),
            actions: role === 'owner' ? [{key:'inviteButton', name:'Invite new members', function:showUserInvite}] : [],
        });
    }

    const kickUser = async (userId) => {
        let result = await roomModel.leaveRoom(userId, roomInfo.id);
    }

    const showUserInvite = () => {
        setPanel({
            header: "Invite new users",
            content: [<InviteForm key='sectionForm' roomInfo={roomInfo}></InviteForm>],
            actions: [{key:'sendInvite', name:"Invite", targetForm:'InviteForm'}, {key:'cancelInvite',name:'Cancel', function:showUserList}],
        });
    }

    return (
        <div className="RoomBar">

            <div className='roomOptions'>
                <h2>{roomInfo.name}</h2>
                <button onClick={showSectionForm}>+ Section</button>
            </div>

            <div className='roomUsers'>
                <div className='hideOnPhone'>Users</div>
                <div className='userList'>
                    {
                        activeUsers.map((data, index) => {
                            console.log("active user:", data);
                            if (index > 2) return;
                            if (data === null) return;
                            return <ProfilePicture key={data.user} pictureName={data.profile_picture}></ProfilePicture>
                        })
                    }
                </div>
                <button onClick={showUserList}><Icon_three_dots/></button>
            </div>
        </div>
    );
}