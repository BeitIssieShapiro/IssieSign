import React from "react";
import { Link } from "react-router";

import {imageLocalCall} from "../apis/ImageLocalCall";
import IssieBase from "../IssieBase";


class ListItem extends IssieBase {

    render() {
    
        let imageSrc = this.props.imageName ? imageLocalCall(this.props.imageName) : "image1.png";
        var image2 = "";
        if (this.props.imageName2) {
            let imageSrc2 = this.props.imageName ? imageLocalCall(this.props.imageName2) : "image2.png";
            image2 = <img  src={imageSrc2} alt="Category Placeholder"></img>
        }
        return (
            <li>
                <A href={this.props.Url}>
                    <table className="listItem"><tbody>
                        <tr>
                            <td className="listImage">
                                <img  src={imageSrc} alt="Category Placeholder"></img>
                                {image2}
                            </td>
                            <td>
                                <p>{this.props.Name}</p>
                            </td>
                        </tr>
                    </tbody></table>
                </A>
            </li>
        );
    }
}
export default ListItem;
