import React from "react";
import FileSystem from "../apis/filesystem";
import { OnOffMenu } from "../settings";
import { translate } from "../utils/lang";
import { withAlert } from 'react-alert'
import ModalDialog from "./modal";




function ShareInfo(props) {

    const toggleCloudSync = (isOn) => {
        props.pubSub.publish({ command: "long-process", msg: "SyncToCloud" });
        FileSystem.get().setSync(entity, isOn, true).then(
            () => props.pubSub.refresh(),
            (err) => props.alert.error("Change failed" + err)
        ).finally(
            () => props.pubSub.publish({ command: "long-process-done" })
        )
    }

    const [category, name] = props.fullName.split("/");
    const entity = name ?
        FileSystem.get().findWord(category, name) :
        FileSystem.get().findCategory(category);


    return <ModalDialog onClose={props.onClose} style={{"--hmargin":"20vw", "--vmargin":"20vw"}} title={translate("SyncToCloud")}>
        <OnOffMenu
            label={translate("SyncToCloud")}
            checked={entity.sync == FileSystem.IN_SYNC || entity.sync == FileSystem.SYNC_REQUEST}
            onChange={toggleCloudSync}
        />
    </ModalDialog>
}

export default withAlert()(ShareInfo);
