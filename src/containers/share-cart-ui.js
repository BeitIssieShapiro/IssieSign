import { Delete } from '@mui/icons-material'
import { confirmAlert } from 'react-confirm-alert';
import { Spacer } from '../components/ui-elements'
import "../css/share-cart-ui.css"
import { fTranslate, translate } from '../utils/lang';
import { trace } from "../utils/Utils";
import { withAlert } from 'react-alert'

const emptyCart = require("../images/empty-share-list.png");

function ShareCartUI({ shareCart, pubSub, alert }) {
    return <div className="share-cart-container">
        <div className="share-cart-title">
            {translate("ShareCartTitle")}
            <div className="share-btn" onClick={() => {
                if (shareCart?.count() > 0) {
                    // Verify all files are sync-ed to cloud:
                    if (!shareCart.isAllSynced()) {
                        confirmAlert({
                            title: translate("ConfirmTitleSyncToServer"),
                            message: translate("ConfirmMsgSyncToServer"),
                            buttons: [
                                {
                                    label: translate("BtnYes"),
                                    onClick: () => {
                                        // triger syncing - long process
                                        pubSub.publish({
                                            command: "long-process",
                                            msg: translate("SyncToCloudMsg")
                                        });

                                        trace("Not all synced - set sync and wait")
                                        shareCart.setAllSynced().then(() => {
                                            pubSub.publish({
                                                command: "long-process-done"
                                            })
                                            shareTheCart(shareCart, alert);
                                        },
                                            (e) => alert.error(fTranslate("ErrSyncFail", e))
                                        ).finally(() => pubSub.publish({
                                            command: "long-process-done"
                                        }));
                                    }
                                },
                                {
                                    label: translate("BtnCancel"),
                                    onClick: () => alert.info(translate("ShareCancelled"))
                                }
                            ]
                        });
                    } else {
                        trace("all was synced - start share")
                        shareTheCart(shareCart, alert);
                    }
                }
            }}>Share...</div>
        </div>

        <div className="share-cart">
            <div className="share-cart-table-title">
                <div></div>
                <div>{translate("ShareCartCategoryColumnTitle")}</div>
                <div>{translate("ShareCartWordNameColumnTitle")}</div>
            </div>
            <div className="share-cart-body">
            {
                shareCart?.items.map((si, i) => {
                    const item = shareCart.get(i);
                    return (<div className="share-cart-item">
                        <image><img src={item.image}/></image>
                        <item>{item.category}</item>
                        <item>{item.name}</item>
                        <image>
                            <Delete onClick={() => {
                            shareCart.remove(si.name);
                            pubSub.refresh();
                        }} />
                        </image>
                    </div>
                    )
                })
            }
            {shareCart?.items.length === 0 && <div className="empty-cart">
                <img src={emptyCart}/>
                <text>{translate("EmptyShareCart")}</text>
            </div>}
            </div>
        </div>
        <Spacer height={15} />

    </div >
}


function shareTheCart(shareCart, alert) {
    trace("Sharing cart")
    shareCart.generateFile().then((filePath) =>
        share(filePath, "Share", "",
            () => alert.success(translate("InfoSharingSucceeded")),
            (e) => alert.error(fTranslate("InfoSharingFailed", e))
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

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
};

export default withAlert()(ShareCartUI);
