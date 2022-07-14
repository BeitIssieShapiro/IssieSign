import React, { useState } from "react";
import FileSystem from "../apis/filesystem";
import { translate } from "../utils/lang";
import { withAlert } from 'react-alert'
import ModalDialog from "./modal";
import { Sync } from '@mui/icons-material'

import "../css/share-info.css"

import "../css/settings.css"


function ShareInfo(props) {

    const [syncInProcess, setSyncInProcess] = useState(false);

    const toggleCloudSync = (isOn) => {
        props.pubSub.publish({ command: "long-process", msg: "SyncToCloud" });
        setSyncInProcess(true);
        FileSystem.get().setSync(entity, isOn, true).then(
            () => props.pubSub.refresh(),
            (err) => props.alert.error("Change failed" + err)
        ).finally(
            () => {
                props.pubSub.publish({ command: "long-process-done" })
                setSyncInProcess(false);
            }
        )
    }

    const [category, name] = props.fullName.split("/");
    const entity = name ?
        FileSystem.get().findWord(category, name) :
        FileSystem.get().findCategory(category);


    return <ModalDialog onClose={props.onClose} style={{ "--hmargin": "20vw", "--vmargin": "20vw" }} title={translate("SyncToCloud")}>
        <div className="shareInfo">
            <div className="shareInfoLabel">{translate("SyncToCloud")}</div>
            <div>
                <label className="form-switch">
                    <input type="checkbox"
                        checked={entity.sync == FileSystem.IN_SYNC || entity.sync == FileSystem.SYNC_REQUEST}
                        onChange={(e) => toggleCloudSync(e.target.checked)} />
                    <i></i>
                </label>
            </div>

            <div className="shareInfoLabel">status</div>
            <div>{entity.sync ? entity.sync : "not synced"}</div>
            {entity.syncErr && <div className="shareInfoLabel">Error</div>}
            {entity.syncErr && <div>{entity.syncErr}</div>}

            {syncInProcess && <div className="syncinProcess" ><Sync className="rotate" /><div> in process</div></div>}

        </div>
    </ModalDialog>
}

export default withAlert()(ShareInfo);
