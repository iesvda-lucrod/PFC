import './RoomCard.css';
export default function RoomCard({id, name}) {
    return (
        <div className='RoomCard'>
            <div>
                <h2>{name}</h2>
            </div>
            
            <div>
                <span>Room id: {id}</span>
                <span>Members: WIP</span>
                <span>Creation date</span>
                <span>Last accessed</span> {/* <--- Save this in relation table*/}
            </div>
        </div>
    );
}