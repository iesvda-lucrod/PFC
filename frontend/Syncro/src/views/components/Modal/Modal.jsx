import './Modal.css';

export default function Modal({ isOpen, onClose, children }) {

    return (
        <div className={"Modal " + (isOpen ? "ModalOpen" : "ModalClosed")}>
            <div className="ModalContainer">
                <button className="closeButton" onClick={onClose}>X</button>
                <div className="ModalContent">    
                    {children}
                </div>
            </div>
        </div>
    );
}