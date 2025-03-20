export default function useFormInput() {
    //TODO Hook for form input state, handlestate and (submit?)
    const [ inputValue, setInputValue ] = useState('');

    const handleChange = (e) => {
        const targetInput = e.target;
        setInputValue(targetInput.vaue);
    }

    //A constant can be defined like "const isSending = status === 'sending'""; here status is a state
}