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

    static isHighResolution() {
        return window.innerHeight > 1200 || window.innerWidth < 1200;
    }

    static isLandscape() {
        return (window.innerWidth > window.innerHeight);
    }

    static updateDimensions() {
        let ret = {
            height: window.innerHeight,
            width: window.innerWidth,
        };
        let numBoxSize = Math.round(window.innerWidth / 230);

        if (IssieBase.isMobile()) {

            let boxSize = Math.min(200, window.innerWidth / numBoxSize);

            ret.imageBoxWidth = (.4 * boxSize) + 'px';
            //ret.marginLeftBox = (.1 * boxSize) + 'px';
            ret.boxWidth = (.53 * boxSize) + 'px';
            ret.shelfWidth = (.73 * boxSize) + 'px';
            ret.tileGroupWidth = (.95 * boxSize) + 'px';
            ret.tileGroupWidthNumeric = (.95 * boxSize);
            ret.shellPadding = (.05 * boxSize) + 'px';
            ret.overFlowX = 'hidden';
        } else {
            ret.imageBoxWidth = '94px';
            //ret.marginLeftBox = '24px';
            ret.boxWidth = '124px';
            ret.shelfWidth = '170px';
            ret.tileGroupWidth = '220px';
            ret.tileGroupWidthNumeric = 220;
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
        setTimeout(() => {
            const newState = IssieBase.getDerivedStateFromProps();
            this.setState(newState);
            console.log("resize", newState.dimensions.width, newState.dimensions.height, window.innerHeight);
        }, 1);
    }

}
IssieBase.propTypes = {
    children: PropTypes.any
};


export default IssieBase
