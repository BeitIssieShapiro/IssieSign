import React from 'react';
import { translate } from '../utils/lang';

import {imageLocalCall} from '../apis/ImageLocalCall'
export function CategoryList(props) {
    return (
        <div className="listhost">

            <ul >
                {props.children}
            </ul>

        </div>
    );
}


export function ListItem(props) {
    let imageSrc = props.imageName ? imageLocalCall(props.imageName) : "image1.png";
    return (
        <li>
            <div onClick={props.callback}>
                <table className="listItem"><tbody>
                    <tr>
                        <td className="listImage">
                            <img src={imageSrc} alt={translate("MissingImageAlt")}></img>
                        </td>
                        <td>
                            <p>{props.name}</p>
                        </td>
                    </tr>
                </tbody></table>
            </div>
        </li>
    );

}

