
import AnimateHeight from 'react-animate-height';
import '../css/slideup-menu.css';
import Tile2 from './Tile2';


export function SlideupMenu(props) {
    return <div className={props.height > 0 ? "slideup-menu-outer" : ""} onClick={props.onClose}>
        <AnimateHeight
            className="slideup-menu-main"
            duration={500}
            height={props.height}
        >
            <div className="slideup-menu-title">
                {props.type === "tile" && <div className="slideup-menu-title-tile-img" >

                    <Tile2 key="1" dimensions={props.dimensions} tileName={""} imageName={props.image}
                        themeId={props.themeId} noMoreMenu={true} />
                </div>}
                {props.type === "tile" && <div className="slideup-menu-title-tile-text">
                    {props.label}
                </div>}
                {props.type === "card" && <div className="slideup-menu-title-img" >
                    <img src={props.image} style={{ width: 60, height: 60 }} />
                </div>}
                {props.type === "card" && <div className="slideup-menu-title-text">
                    {props.label}
                </div>}
                {props.type === "colors" && <div className="slideup-menu-title-text">
                    {props.label}
                </div>}
            </div>
            <div className={props.type === "colors" ? "slideup-menu-body-colors" : "slideup-menu-body"}>
                {
                    props?.buttons?.map((btn, i) => (<div
                        className="slideup-menu-item"
                        key={i}
                        onClick={() => {
                            btn?.callback();
                            props.onClose();
                        }}
                    >
                        {btn.icon}
                        {btn.caption}
                    </div>))
                }
            </div>
        </AnimateHeight>
    </div>
}