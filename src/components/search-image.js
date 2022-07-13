import { useState } from "react"
import ImageLibrary from "../apis/image-library"
import { isRTL, translate } from "../utils/lang";
import ModalDialog from "./modal";



export default function SearchImage({ onClose, onSelectImage }) {
    const [value, setValue] = useState("")
    const [results, setResults] = useState([]);

    return <ModalDialog title={translate("SearchImageTitle")} onClose={onClose}>
        <div dir={isRTL() ? "rtl" : "ltr"}>
            <input type="search" className="search"
                style={{
                    direction: isRTL() ? "rtl" : "ltr",
                    fontSize: 35,
                    lineHeight: 35,
                    height: 35
                }}
                value={value} onChange={(e) => setValue(e.target.value)} />
            <button className="addButton" disabled={value.length < 2}
                onClick={() => {
                    ImageLibrary.get().search(value).then((res) => {
                        setResults(res)
                    });
                }} style={{ width: 150, height: 35 }}>חפש</button>
        </div>
        <div>
            {results?.length > 0 ? results.map((item, i) => (<img
                style={{ height: 100, width: 100, margin: 10 }}
                key={i}
                src={item.url}
                onClick={() => onSelectImage(item.url)
                }
            />)) :
                <h1>{translate("NoResults")}</h1>}
        </div>


    </ModalDialog>
}