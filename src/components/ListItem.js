import React from "react";
import { Link } from "react-router";

import {imageLocalCall} from "../apis/ImageLocalCall";
import IssieBase from "../IssieBase";


class ListItem extends IssieBase {

    render() {
    
        let imageSrc = this.props.imageName ? imageLocalCall(this.props.imageName) : "image1.png";
        return (
            <li>
                <Link to={this.props.Url}>
                    <table className="listItem"><tbody>
                        <tr>
                            <td className="listImage">
                                <img  src={imageSrc} alt="Category Placeholder"></img>
                            </td>
                            <td>
                                <p>{this.props.Name}</p>
                            </td>
                        </tr>
                    </tbody></table>
                </Link>
            </li>
        );
    }
}
export default ListItem;
