import './RoomCard.css';
import { Link } from 'react-router-dom';

export default function RoomCard({roomInfo, onClose}) {

    return (
        <div className='RoomCard'>
            <div>
                <h3>{roomInfo.name}</h3>
                <button onClick={onClose}>X</button>
            </div>
            
            <div>
                <p>Room id: {roomInfo.id}</p>
                <p>Members: WIP</p>
                <p>Creation date: {roomInfo.creation_date}</p>
                <p>Last accessed: {roomInfo.access_date}</p> {/* <--- Save this in relation table*/}
            </div>
            <Link role="button" to={"/dashboard/"+roomInfo.id}>ENTER</Link>
        </div>
    );
}