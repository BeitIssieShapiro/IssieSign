import { AppType } from "../utils/Utils";

import "../css/apptype-selector.css";
import { ReactComponent as MainImg } from '../images/IssieSignMain.svg'
import { ReactComponent as IssieImg } from '../images/IssieSign_opt.svg'
import { ReactComponent as MyIssieImg } from '../images/MyIssieSign_opt.svg'

export { IssieImg, MyIssieImg }

export function AppTypeButton({ name, desc, desc2, desc3, icon, onClick }) {
    return <div className="app-type-button" onClick={() => onClick()}>
            <div className="app-type-button-img">{icon}</div>
            <div className="app-type-btn-text">
                <div className="app-type-button-name">{name}</div>
                <div>
                    <div className="app-type-button-desc">{desc}</div>
                    {desc2 && <div className="app-type-button-desc">{desc2}</div>}
                    {desc3 && <div className="app-type-button-desc">{desc3}</div>}
                </div>
            </div>
    </div>
}

export default function AppTypeSelection({ onType }) {
    return <div className="app-type-host">
        <MainImg className="app-type-main-img" />
        <div className="app-type-title">Welcome to IssieSign!</div>
        <div className="app-type-buttons-area">

            <div className="app-type-buttons-area-text">Select an app to start</div>

            <AppTypeButton name="IssieSign" desc="For Hebrew speakers" desc2="אפליקציה להיכרות ולמידה" desc3="של סימנים וג'סטות"
                icon={<IssieImg />} onClick={() => onType(AppType.IssieSign)} />

            <AppTypeButton name="My IssieSign" desc="Open platform to create your own sign language library" desc2="(suitable for all languages)"
                icon={<MyIssieImg />} onClick={() => onType(AppType.MyIssieSign)} />

        </div>
    </div>
}