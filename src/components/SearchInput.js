import "../css/search.css";
import React from "react";
import IssieBase from "../IssieBase";

class SearchInput extends IssieBase {
    constructor(props){
        super(props);
        if (props.onChange !== undefined) {
            this.handleChange = props.onChange;
        }
        this.state = {value:props.value};
    }

    componentWillReceiveProps(props) {
        this.setState({value:props.value});
    }

    handleChange (e){
        this.setState({value:e.target.value});
    }

    render() {
        let searchClassName = this.state.narrow? "": "sameLine";
        return (
            <div slot={this.props.slot} className={"search " + searchClassName}>
                <input ref="input" type="search" onChange={this.handleChange}
                onFocus={this.preventKeyBoardScrollApp} value={this.state.value} />
            </div>
        );
    }
    preventKeyBoardScrollApp() {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }
}
export default SearchInput;

 