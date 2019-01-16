import React, { Component } from 'react';
import PropTypes from "prop-types";


class IssieBase extends Component {
    constructor(props) {
        super(props);      

        this.updateDimensions = this.updateDimensions.bind(this);
        this.isMobile = this.isMobile.bind(this);
    }

    isMobile() {
        return window.innerHeight < 450 || window.innerWidth < 450 ;
    }

    isLandscape() {
        return (window.innerWidth > window.innerHeight);
    }
    
    updateDimensions() {
        var isNarrow = window.innerWidth < 700;
        this.setState({width:window.innerHeight, narrow:isNarrow})
    }

    componentWillMount(){
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
