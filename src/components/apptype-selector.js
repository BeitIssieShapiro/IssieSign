import { AppType } from "../utils/Utils";

import "../css/apptype-selector.css";

export default function AppTypeSelection({ onType }) {
    return <div className="app-type-host">
        <div className="app-type-button" onClick={()=>onType(AppType.IssieSign)}>
            <img className="app-type-button-img" src={require("../images/IssieSign.png")}></img>
            <div className="app-type-button-desc">IssieSign</div>
        </div>
        <div className="app-type-button"  onClick={()=>onType(AppType.MyIssieSign)}>
        <img className="app-type-button-img" src={require("../images/MyIssieSign.png")}></img>
            <div className="app-type-button-desc">My IssieSign</div>
        </div>
    </div>
}