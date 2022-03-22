import React, { ReactNode, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import style from './modal.module.scss';

function Modal({ show, onClose, children, title } : {show: boolean; onClose: ()=>void; children: ReactNode | undefined, title?: ReactNode|string}) {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        const classes = (e.target as HTMLElement).classList;
        for(let i = 0, l=classes.length; i<l;i++)
            if(/.*modal-wrapper.*/.test(classes[i])) return false;
        
        onClose();
    };

    const modalContent = show ? (
        <div className={style["modal-overlay"]}>
            <div className={style["modal-wrapper"]}>
                <div className={style["modal-header"]}>
                    <a href="#" onClick={handleCloseClick}>x</a>
                </div>
                {title && <div className={style["modal-title"]}>{title}</div>}
                <div className={style["modal-body"]}>{children}</div>
            </div>
        </div>
    ) : null

    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal-root") as HTMLElement
        );
    } else {
        return null;
    }

}

export default Modal;