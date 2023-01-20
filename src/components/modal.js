
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import "../css/modal.css";

export default function ModalDialog(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setTimeout(()=>setOpen(true), 50);
      }, []);

    const style = props.animate?
        {width:(open?props.width:0), transition: "width 500ms"}:
        props.width?{width:props.width}:{}
    
    return <div className="modal" onClick={props.onClose}  slot={props.slot}>
        <div className="modalInner" onClick={(evt)=>evt.stopPropagation()}  
        style={{...props.style, ...style}}
>
            {props.title && <div className="modalTitle" style={props.titleStyle}>{props.title}</div>}
            <div className="btnClose" onClick={props.onClose}><Close style={{fontSize:35, color: "#A7A7A7"}}/></div>
            <div className="modalContent">
                {props.children}
            </div>
        </div>
    </div>
}