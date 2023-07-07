import { useState } from "react"
import ImageLibrary from "../apis/image-library"
import { translate } from "../utils/lang";
import ModalDialog from "./modal";
import "../css/search-image.css";



export default function SearchImage({ onClose, onSelectImage, pubSub }) {
    const [value, setValue] = useState("")
    const [results, setResults] = useState();

    const doSearch = () => {
        pubSub.publish({ command: "set-busy", active: true });
        ImageLibrary.get().search(value).then((res) => {
            setResults(res)
        }).finally(() => pubSub.publish({ command: "set-busy", active: false }))
    }

    return <ModalDialog title={translate("SearchImageTitle")} onClose={onClose} style={{ left: "5vh", right: "5vh", "--vmargin": "5vw" }}>
        <div className="searchRoot">
            <div className="searchTextAndBtnContainer">
                <input type="search"
                    placeholder={translate("EnterSearchHere")}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    onKeyUp={e=>{
                        if (e.key == "Enter") {
                            doSearch();
                        }
                    }}
                />
                {/* {value?.length > 0 && <div className="cleanSearchX" onClick={()=>setValue("")}>x</div>} */}
                <div className="searchImageBtn" disabled={value.length < 2}
                    onClick={doSearch}
                >{translate("BtnSearch")}
                </div>
            </div>
            <div className="resultContainer">
                {results && (results.length > 0 ? results.map((item, i) => (
                    <img className="foundItem"
                        key={i}
                        src={item.url}
                        onClick={() => {
                            onSelectImage(item.url)
                        }}
                    />)) :
                    <div className="noResultMsg">{translate("NoResultsMsg")}</div>)}
            </div>

        </div>
    </ModalDialog>
}