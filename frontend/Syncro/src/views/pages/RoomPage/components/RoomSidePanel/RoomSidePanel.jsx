import './RoomSidePanel.css';
import { useRoomContext } from '../../../../../contexts/RoomContext/RoomContext';
import { Icon_arrow_left, Icon_arrow_right } from '../../../../../assets/icons';

export default function RoomSidePanel() {
    const { 
        sidePanel: { panelOpen, setPanelOpen,panelInfo }
    }  = useRoomContext();

    return (
        <div className={"RoomSidePanel "+ (panelOpen && 'open')}>

            <div className="header">
                <div className='title'>
                    <h3>{panelInfo.header}</h3>
                </div>
            </div>

            <div className="content">
            {
                panelInfo.content.map((component, index) => {
                    //console.log("COMPONENT: ", component);
                    if (!component) return;
                    return (
                    <div key={component.key+index} className='componentContainer'>
                        {component}
                    </div>
                    )
                })
            }
            </div>

            <div className="actions">
                {
                    panelInfo.actions.map((button, index) => {
                        console.log("ACTION ICON", button.icon);
                        return <button
                            className={button.className}

                            key={button.key+index} 
                            onClick={button.function || null}

                            form={button.targetForm || ''}
                            type={button.targetForm ? 'submit' : ''}
                        >
                            <span className={button.icon === undefined ? '': 'hideOnSmall'}>{button.name}</span>
                            {button.icon}
                        </button>
                    })
                }
            </div>

            <div className='toggleButton'>
                <button onClick={() => {setPanelOpen(!panelOpen)}}>
                <div className='gradient'></div>
                    {panelOpen ?  <Icon_arrow_right/> : <Icon_arrow_left/>}
                </button>
            </div>

        </div>
    );
}