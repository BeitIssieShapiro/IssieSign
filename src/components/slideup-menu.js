
import AnimateHeight from 'react-animate-height';
import '../css/slideup-menu.css';
import Tile2 from './Tile2';
import FileSystem from '../apis/filesystem';
import { imageLocalCall } from '../apis/ImageLocalCall';
import { Close } from '@mui/icons-material';


export function SlideupMenu(props) {

    const isCategories = props.type == "categories";

    return <div className={props.height > 0 ? "slideup-menu-outer" : ""} onClick={props.onClose}>
        <AnimateHeight
            className="slideup-menu-main"
            duration={500}
            height={isCategories && props.height > 0 ? "80%" : props.height}
        >
            <div className="slideup-menu-close-btn">
                <Close onClick={() => props.onClose()} />
            </div>
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
                {props.type === "categories" && <div className="slideup-menu-title-text">
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
                            props.onClose();
                            btn?.callback();
                        }}
                    >
                        {btn.icon}
                        {btn.caption}
                    </div>))
                }
                <div scroll-marker="1" style={{
                    height: "100%",
                    transform: `translateX(${props.scroll?.x || 0}px) translateY(${props.scroll?.y || 0}px)`,
                    
                }}>
                    {
                        // Categories
                        isCategories && FileSystem.get().getCategories()
                            .filter(cat => cat.userContent && !props.omitCategories.find(oc => oc == cat.id))
                            .map((cat, i) => (
                                <div
                                    className="slideup-menu-item"
                                    key={i}
                                    onClick={() => {
                                        props.callback(cat.name);
                                        props.onClose();
                                    }}
                                >
                                    <div className='slideup-menu-item-img'>
                                        <img src={imageLocalCall(cat.imageName, cat.userContent)} />
                                    </div>
                                    <div>{cat.name}</div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </AnimateHeight>
    </div>
}