import { Component } from 'react';
import PropTypes from "prop-types";

class IssieBase extends Component {
    constructor(props) {
        super(props);
        this.resizeListener = this.resizeListener.bind(this);
        this.state = IssieBase.getDerivedStateFromProps();
    }

    static isMobile() {
        return window.innerHeight < 450 || window.innerWidth < 450;
    }

    static isLandscape() {
        return (window.innerWidth > window.innerHeight);
    }

    static updateDimensions() {
        let ret = {};
        if (IssieBase.isMobile()) {
            let numBoxSize = Math.round(window.innerWidth / 230);

            let boxSize = window.innerWidth / numBoxSize;

            ret.imageBoxWidth = (.4 * boxSize) + 'px';
            ret.marginLeftBox = (.1 * boxSize) + 'px';
            ret.boxWidth = (.53 * boxSize) + 'px';
            ret.shelfWidth = (.73 * boxSize) + 'px';
            ret.tileGroupWidth = (.95 * boxSize) + 'px';
            ret.shellPadding = (.05 * boxSize) + 'px';
            ret.overFlowX = 'hidden';
        } else {
            ret.imageBoxWidth = '94px';
            ret.marginLeftBox = '24px';
            ret.boxWidth = '124px';
            ret.shelfWidth = '170px';
            ret.tileGroupWidth = '220px';
            ret.shellPadding = '10px';
            ret.overFlowX = 'visible';
        }
        return ret;
    }
    static getDerivedStateFromProps(props, state) {
        return {
            dimensions: IssieBase.updateDimensions(),
            //narrow: window.innerWidth < 700,
            //width: window.innerHeight
        };
    }

    resizeListener() {
        this.setState(IssieBase.getDerivedStateFromProps());
        console.log("resize detected");
    }
    
}
IssieBase.propTypes = {
    children: PropTypes.any
};


export default IssieBase
