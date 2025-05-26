import './Modal.css';

export default function Modal({ isOpen, setIsOpen, children }) {

    return (
        <div className={"Modal " + (isOpen ? "ModalOpen" : "ModalClosed")}>
            <div className="ModalContainer">
                <button className="closeButton" onClick={() => setIsOpen(false)}>X</button>
                <div className="ModalContent">    
                    {children}
                </div>
            </div>
        </div>
    );
}