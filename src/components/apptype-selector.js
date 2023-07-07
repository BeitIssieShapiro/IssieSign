import { AppType } from "../utils/Utils";

import "../css/apptype-selector.css";
import { ReactComponent as MainImg } from '../images/IssieSignMain.svg'
import { ReactComponent as IssieImg } from '../images/IssieSign_opt.svg'
import { ReactComponent as MyIssieImg } from '../images/MyIssieSign_opt.svg'

export {IssieImg, MyIssieImg}

export function AppTypeButton({ name, desc, icon, onClick }) {
    return <div className="app-type-button" onClick={() => onClick()}>
        <div className="app-type-button-img">{icon}</div>
        <div className="app-type-btn-text">
            <div className="app-type-button-name">{name}</div>
            <div className="app-type-button-desc">{desc}</div>
        </div>
    </div>
}

export default function AppTypeSelection({ onType }) {
    return <div className="app-type-host">
        <MainImg className="app-type-main-img" />
        <div className="app-type-title">Welcome to IssieSign!</div>
        <div className="app-type-buttons-area">
            <div className="app-type-buttons-area-text">Select an app to start.</div>
            <AppTypeButton name="IssieSign" desc="Full content for hebrew Sign Language"
                icon={<IssieImg />} onClick={() => onType(AppType.IssieSign)} />

            <AppTypeButton name="My IssieSign" desc="Universal app for gestures sharing"
                icon={<MyIssieImg />} onClick={() => onType(AppType.MyIssieSign)} />
        </div>
    </div>
}