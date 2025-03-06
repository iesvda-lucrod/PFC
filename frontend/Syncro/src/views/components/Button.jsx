/**
 * Button that will execute the provided action onClick 
 * or send a signal to a controller if specified
 * @param {*} props 
 * @returns 
 */
export default function Button(props) {
    const { controller = null, action = () => console.error('no action defined'), data = null, children} = props;

    const callController = () => {
        console.log('calling controller:', controller, 'action:', action, 'with data:', data);
        controller.execute(action, data);
    }

    const executeAction = (event) => {
        console.log("executed action", action, 'with data:', data);
        event?.preventDefault(); // Prevents form submission default behavior
        action(data);
    }

    return (
        <>
        <button onClick={controller == null ? executeAction : callController }>{ children }</button>
        </>
    );
}