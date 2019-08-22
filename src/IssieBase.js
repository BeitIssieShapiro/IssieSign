import { Component } from 'react';
import PropTypes from "prop-types";

class IssieBase extends Component {
    constructor(props) {
        super(props);

        this.imageBoxWidth = '94px';
        this.marginLeftBox = '24px';
        this.boxWidth = '124px';
        this.shelfWidth = '170px';
        this.tileGroupWidth = '220px';
        this.shellPadding = '10px';




        this.updateDimensions = this.updateDimensions.bind(this);
        this.isMobile = this.isMobile.bind(this);
    }

    isMobile() {
        return window.innerHeight < 450 || window.innerWidth < 450;
    }

    isLandscape() {
        return (window.innerWidth > window.innerHeight);
    }

    updateDimensions() {
        var isNarrow = window.innerWidth < 700;
        if (this.isMobile()) {
            let numBoxSize = Math.round(window.innerWidth / 230);

            let boxSize = window.innerWidth / numBoxSize;

            this.imageBoxWidth = (.4 * boxSize) + 'px';
            this.marginLeftBox = (.1 * boxSize) + 'px';
            this.boxWidth = (.53 * boxSize) + 'px';
            this.shelfWidth = (.73 * boxSize) + 'px';
            this.tileGroupWidth = (.95 * boxSize) + 'px';
            this.shellPadding = (.05 * boxSize) + 'px';
            this.overFlowX = 'hidden';

        }
        this.setState({ width: window.innerHeight, narrow: isNarrow })
    }

    componentWillMount() {
        this.updateDimensions();
    }
    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

}

IssieBase.propTypes = {
    children: PropTypes.any
};


export default IssieBase
