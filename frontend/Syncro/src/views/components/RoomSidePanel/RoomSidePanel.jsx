import './RoomSidePanel.css';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import { useEffect } from 'react';

export default function RoomSidePanel() {
    const { 
        sidePanel: { panelOpen, setPanelOpen,panelInfo }
    }  = useRoomContext();

    useEffect(() => {
        console.log("Sidepanel content changed:", panelInfo);
    }, [panelInfo]);

    return (
        <div className={"RoomSidePanel "+ (panelOpen && 'open')}>

            <div className="header">
                <div className='detailsTitle'>
                    {panelInfo.header}
                </div>
            </div>

            <div className="content">
                {panelInfo.content}
                {/*TODO <div className='detailsDescription'></div>*/}
            </div>

            <div className="actions">
                {
                    panelInfo.actions.map((button, index) => {
                        return <button
                            key={button.key+index} 
                            onClick={button.function || null}
                            form={button.targetForm || ''}
                            type={button.targetForm ? 'submit' : ''}
                        >{button.name}</button>
                    })
                }
            </div>

            <div className='toggleButton'>
                <button onClick={() => {setPanelOpen(!panelOpen)}}>
                    {panelOpen ? ">" : '<'}
                </button>
            </div>

        </div>
    );
}