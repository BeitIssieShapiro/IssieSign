
import IssieBase from "../IssieBase";


class List extends IssieBase {

    render(){
        return (
        <div className="listhost">

            <ul >
                {this.props.children}
            </ul>

        </div>
        );
    }
}

export default List;
