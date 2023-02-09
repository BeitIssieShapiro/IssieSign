import React from "react";
import '../css/info.css';

export default function InfoMyIssieSign(props) {
    return (
        <div className={"info"} scroll-marker="1" style={{
            transform: `translateY(${props.scroll?.y || 0}px)`,
            transitionDuration: '0s',
        }}>
            <div className="infoTitle">
                <div style={{ color: '#fbaa19' }}>My Issie</div>
                <div style={{ color: '#18b9ed' }}>Sign</div>
            </div>

            <div className="en" >
                <bold>MyIssieSign</bold> is an app for creating your own sign language video library. It was developed especially for people with complex communication needs who can benefit from the use of gestures to expand their ability to communicate.
                <br />The app has many customizable features including the ability to easily organize your videos by category, tag folders and videos with symbols to improve navigation for non-readers, and adjust touch settings.
            </div>
            <br />
            <div className="en" >
                These features create a simple, clear and tailor-made design allowing for easy access and navigation for people with motoric or intellectual difficulties. My IssieSign can be a significant tool for learning new gestures and thus can help people with complex communication needs express themselves more effectively.
                <br /><br />

                <bold>MyIssieSign</bold>, developed through the collaboration of The Technology Center of Beit Issie Shapiro and SAP Labs Israel, is one of a series of apps we have created with the aim of improving participation and quality of life.
                <br /><br />The Technology Center at Beit Issie Shapiro serves as a leading hub for promoting innovation and entrepreneurship in the field of Assistive Technology (AT) bringing more accessible and affordable solutions to people with disabilities. We provide consultation and training services to families and professionals and consultation and support to developers and entrepreneurs helping them create apps and products that are accessible to a wider audience including people with disabilities.

            </div>
        </div>
    )

}
