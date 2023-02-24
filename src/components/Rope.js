import React from "react";

import "../css/rope.css";

class Rope extends React.Component {
    render() {
        let addClass = ""
        if (this.props.size == 1) {
            addClass = "rope-small";
        } else if (this.props.size > 1 && this.props.size < 5) {
            addClass = "rope-medium";
        } else if (this.props.size >= 5 && this.props.size < 15) {
            addClass = "rope-large";
        } else {
            addClass = "rope-huge";
        }


        return (
            <div>
                {this.props.addMode === true ? <div style={{ height: '35px' }} /> :
                    <div className={"rope " + addClass}></div>}
                <div className="rope-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Rope;