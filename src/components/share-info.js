import React, { useState } from "react";
import FileSystem from "../apis/filesystem";
import { fTranslate, translate } from "../utils/lang";
import { withAlert } from 'react-alert'
import ModalDialog from "./modal";
import { Sync } from '@mui/icons-material'

import "../css/share-info.css"

import "../css/settings.css"
import { RadioBtn } from "./ui-elements";


function ShareInfo(props) {

    const [syncInProcess, setSyncInProcess] = useState(false);

    const toggleCloudSync = (isOn) => {
        props.pubSub.publish({ command: "long-process", msg: translate("SyncToCloudMsg") });
        setSyncInProcess(true);
        FileSystem.get().setSync(entity, isOn, true).then(
            () => props.pubSub.refresh(),
            (err) => props.alert.error(fTranslate("ErrSyncFail", err))
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
            <div className="shareInfoLabel">{translate("SyncToCloudTitle")}</div>
            <div>
                <RadioBtn
                    checked={entity.sync == FileSystem.IN_SYNC || entity.sync == FileSystem.SYNC_REQUEST}
                    onChange={(isOn) => toggleCloudSync(isOn)}
                />
            </div>

            <div className="shareInfoLabel">{translate("SyncStatusLbl")+":"}</div>
            <div>{entity.sync ? entity.sync : translate("SyncStatusNone")}</div>
            {entity.syncErr && <div className="shareInfoLabel">{translate("SyncErrorLbl")}</div>}
            {entity.syncErr && <div>{entity.syncErr}</div>}

            {syncInProcess && <div className="syncinProcess" ><Sync className="rotate" /><div>{translate("SyncToCloudMsg")}</div></div>}

        </div>
    </ModalDialog>
}

export default withAlert()(ShareInfo);
