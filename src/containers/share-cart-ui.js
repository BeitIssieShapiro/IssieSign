import { Delete } from '@mui/icons-material'
import { confirmAlert } from 'react-confirm-alert';
import { Spacer } from '../components/ui-elements'
import "../css/share-cart-ui.css"
import { translate } from '../utils/lang';
import { withAlert } from 'react-alert'

function ShareCartUI({ shareCart, pubSub, alert }) {
    return <div style={{ width: "100%", color: "black" }}>
        <h1>Share List</h1>
        <table className="share-cart">
            <tr>
                <th className="category">Category</th>
                <th className="name">Name</th>
                <th></th>
            </tr>
            {
                shareCart?.items.map((si, i) => {
                    const item = shareCart.get(i);
                    return (<tr key={i}>
                        <td>{item.category}</td>
                        <td>{item.name}</td>
                        <td><Delete onClick={() => {
                            shareCart.remove(si.name);
                            pubSub.refresh();
                        }} /></td>
                    </tr>
                    )
                })
            }
        </table>
        <Spacer height={15} />
        <button onClick={() => {
            if (shareCart?.count() > 0) {
                // Verify all files are sync-ed to cloud:
                if (!shareCart.isAllSynced()) {
                    confirmAlert({
                        title: translate("ConfirmSyncToServerTitle"),
                        message: translate("ConfirmSyncToServer"),
                        buttons: [
                            {
                                label: translate("BtnYes"),
                                onClick: () => {
                                    // triger syncing - long process
                                    pubSub.publish({
                                        command: "long-process",
                                        msg: translate("syncWordsToCloud")
                                    });

                                    console.log("not all synced - set sync and wait")
                                    shareCart.setAllSynced().then(() => {
                                        console.log("set all sync done, share the cart")
                                        pubSub.publish({
                                            command: "long-process-done"
                                        })
                                        shareTheCart(shareCart, alert);
                                    },
                                        (e) => alert.error(translate("InfoSharingFailed") + "\n" + e)
                                    ).finally(() => pubSub.publish({
                                        command: "long-process-done"
                                    }));
                                }
                            },
                            {
                                label: translate("BtnCancel"),
                                onClick: () => alert.info(translate("InfoSharingCencelled"))
                            }
                        ]
                    });
                } else {
                    console.log("all was synced - start share")
                    shareTheCart(shareCart, alert);
                }
            }
        }}>Share ...</button>
    </div >
}


function shareTheCart(shareCart, alert) {
    console.log("sharing cart")
    shareCart.generateFile().then((filePath) =>
        share(filePath, "Share", "",
            () => alert.success(translate("InfoSharingSucceeded")),
            (e) => alert.error(translate("InfoSharingFailed") + "\n" + e)
        ));
}

function share(filePath, title, mimetype, onSuccess, onError) {
    if (typeof filePath !== "string") {
        filePath = "";
    }
    if (typeof title !== "string") {
        title = "Share";
    }
    if (typeof mimetype !== "string") {
        mimetype = "text/plain";
    }

    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
        message: '', // not supported on some apps (Facebook, Instagram)
        subject: translate("ShareWords"), // fi. for email
        files: [filePath], // an array of filenames either locally or remotely
        chooserTitle: translate("ShareWords"), // Android only, you can override the default share sheet title
        iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };

    console.log("about to share via shareWithOptions:", JSON.stringify(options));
    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
};

export default withAlert()(ShareCartUI);
