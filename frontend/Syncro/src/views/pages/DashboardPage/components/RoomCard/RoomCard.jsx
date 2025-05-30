import './RoomCard.css';
import { Link } from 'react-router-dom';

export default function RoomCard({roomInfo, onClose }) {

    return (
        <div className='RoomCard'>
            <div className='cardTitle'>
                <h3>{roomInfo.name}</h3>
                <button onClick={onClose}>X</button>
            </div>
            
            <div className='cardContent'>
                <div className={'description' + (roomInfo.description ? '' : ' empty')}>
                    {roomInfo.description || 'No description provided'}
                </div>
                <Link className='button' role="button" to={"/dashboard/"+roomInfo.id}>Enter</Link>
            </div>
        </div>
    );
}