import { useState } from 'react';
import './RoomDetailsPanel.css';

export default function RoomDetailsPanel() {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ content, setContent ] = useState({
        title: 'Placeholder Title',
        description: 'Placeholder description',
        buttons: [{text:'Placeholder', action:() => console.log('Placeholder')}],
    });

    return (
        
        <div className={"RoomDetailsPanel "+ (isOpen && 'open')}>

            <div className="header">
                <div className='detailsTitle'>
                    {content.title}
                </div>
            </div>

            <div className="content">
                <div className='detailsDescription'>
                    {content.description}
                </div>
            </div>

            <div className="actions">
                {
                    content.buttons.map((button, index) => 
                        <button key={index} onClick={button.action}>{button.text}</button>
                    )
                }
            </div>



            <div className='toggleButton'>
                <button onClick={() => {setIsOpen(!isOpen)}}>
                    {isOpen ? ">" : '<'}
                </button>
            </div>
        </div>
    );
}