import './RoomBar.css';
import InviteForm from './components/InviteForm/InviteForm';
import MemberCard from './components/MemberCard/MemberCard';
import SectionForm from '../SectionForm/SectionForm';
import ProfilePicture from '../../../../components/ProfilePicture/ProfilePicture';
import { Icon_check, Icon_cross, Icon_three_dots } from '../../../../../assets/icons';
import { useRoomContext } from '../../../../../contexts/RoomContext/RoomContext';


export default function RoomBar({ roomInfo, role }) {
    const {
        activeUsers,
        room: { roomModel },
        sidePanel: { setPanel, resetPanel, setPanelOpen }
    } = useRoomContext();


    const showRoomInfo = () => {resetPanel(true);}

    const showSectionForm = () => {
        setPanel({
            header:"Create a section",
            content: [<SectionForm key='sectionForm' editMode={false} submitAction={() => setPanelOpen(false)}/>],
            actions: [
                {key:'confirmSection',  className:'confirmButton',   name:"Confirm",  icon:<Icon_check/>, targetForm:'SectionForm'},
                {key:'cancelSection',   className:'cancelButton',    name:'Cancel',   icon:<Icon_cross/>, function:() => resetPanel(false)}
            ]
        });
    }

    const showUserList = () => {

        const activeIds = activeUsers.map((data)=> {return data.user});
        setPanel({
            header: 'Members',
            content: roomInfo.members.map((member) => {
                return <MemberCard key={member.id} memberInfo={member} kickUser={kickUser} active={activeIds.includes(member.id)} showKickButton={(role == 'owner')}></MemberCard>
            }),
            actions: role === 'owner' ? [{key:'inviteButton', name:'Invite new members', function:showUserInvite}] : [],
        });
    }

    const kickUser = async (userId) => {
        await roomModel.leaveRoom(userId, roomInfo.id);
    }

    const showUserInvite = () => {
        setPanel({
            header: "Invite new users",
            content: [<InviteForm key='sectionForm' roomInfo={roomInfo}></InviteForm>],
            actions: [
                {key:'sendInvite', className:'confirmButton', name:"Invite", icon:<Icon_check/>, targetForm:'InviteForm'},
                {key:'cancelInvite', className:'cancelButton', name:"Cancel", icon:<Icon_cross/>, function:showUserList},
            ],
        });
    }

    

    return (
        <div className="RoomBar">

            <div className='roomOptions'>
                <h2 className='hideOnSmall' onClick={showRoomInfo}>{roomInfo.name}</h2>
                <button className='showOnSmall' onClick={showRoomInfo}>Room info</button>
                <button onClick={showSectionForm}>+ Section</button>
            </div>

            <div className='roomUsers'>
                <div className='hideOnSmall'>Users</div>
                <div className='userList'>
                    {
                        activeUsers.map((data, index) => {
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