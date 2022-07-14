
import "../css/modal.css";

export default function ModalDialog(props) {
    return <div className="modal" onClick={props.onClose} style={props.style} slot={props.slot}>
        <div className="modalInner" onClick={(evt)=>evt.stopPropagation()}>
            {props.title && <div className="modalTitle">{props.title}</div>}
            <div className="btnClose" onClick={props.onClose}>X</div>
            <div className="modalContent">
                {props.children}
            </div>
        </div>
    </div>
}