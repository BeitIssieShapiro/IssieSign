import React from "react";
import "../css/shelf.css";


export default function Shelf(props) {
    return <div className="shelfHost">
        <div className="container">
            {props.children}
        </div>
        <div className="shelf"></div>
    </div>
}