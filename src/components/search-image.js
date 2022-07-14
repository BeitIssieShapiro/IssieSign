import { useState } from "react"
import ImageLibrary from "../apis/image-library"
import { isRTL, translate } from "../utils/lang";
import ModalDialog from "./modal";
import "../css/search-image.css";



export default function SearchImage({ onClose, onSelectImage, pubSub }) {
    const [value, setValue] = useState("")
    const [results, setResults] = useState();

    return <ModalDialog title={translate("SearchImageTitle")} onClose={onClose}>
        <div className="searchRoot">
            <div className="searchTextAndBtnContainer">
                <input type="search" className="searchText"
                    placeholder={translate("EnterSearchHere")}
                    value={value} onChange={(e) => setValue(e.target.value)}
                />
                {value?.length > 0 && <div className="cleanSearchX" onClick={()=>setValue("")}>x</div>}
                <button className="searchImageBtn" disabled={value.length < 2}
                    onClick={() => {
                        pubSub.publish({command:"set-busy", active:true});
                        ImageLibrary.get().search(value).then((res) => {
                            setResults(res)
                        }).finally(()=>pubSub.publish({command:"set-busy", active:false}))
                    }}
                     >{translate("BtnSearchGo")}</button>
            </div>
            <div className="resultContainer">
                {results && (results.length > 0 ? results.map((item, i) => (
                    <img className="foundItem"
                        key={i}
                        src={item.url}
                        onClick={() => onSelectImage(item.url)}
                    />)) :
                    <div className="noResultMsg">{translate("NoResults")}</div>)}
            </div>

        </div>
    </ModalDialog>
}