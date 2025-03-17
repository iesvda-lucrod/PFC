import { useState } from "react";
import './Modal.css';

export default function Modal({ isOpen, setIsOpen, children }) {

    return (
        <div className={"ModalBackground " + (isOpen ? "ModalOpen" : "ModalClosed")}>
            <div className="ModalContainer">
                <div className="ModalTitle">
                    <button className="closeButton" onClick={() => setIsOpen(false)}>X</button>
                </div>
                <div className="ModalContent">
                    {children}
                </div>
            </div>
        </div>
    );
}