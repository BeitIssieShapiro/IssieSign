import React from "react";

import "../css/rope.css";

class Rope extends React.Component {
    render() {
        let addClass = ""
        switch (this.props.size) {
            case "M":
                addClass = "rope-medium";
                break;
            case "L":
                addClass = "rope-large";
                break;
        }
            
            return (
            <div>
                {this.props.addMode === true ? <div style={{height:'35px'}}/> : 
                    <div className={"rope "+ addClass}></div>}
                <div className="rope-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Rope;