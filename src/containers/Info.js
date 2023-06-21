import React from "react";
import '../css/info.css';

export default function Info(props) {
    return (
        <div className="info" scroll-marker="1" style={{
            transform: `translateY(${props.scroll?.y || 0}px)`,
            transitionDuration: '0s',
        }}>
            <div className="infoTitle">
                <div style={{ color: '#fbaa19' }}>Issie</div>
                <div style={{ color: '#18b9ed' }}>Sign</div>
            </div>
            <div className="heb"  >
                <bold>IssieSign</bold> היא אפליקציה להיכרות ולמידה של סימנים בסיסיים להבעת צרכים, רעיונות, תחושות ורצונות המבוססת על שפת הסימנים הישראלית (שס"י). האפליקציה פותחה במיוחד עבור אנשים עם צרכים תקשורתיים מורכבים (CCN), הזקוקים לסימנים וג'סטות כאמצעי תקשורת תומכת וחליפית (תת"ח) להבעת רצונות, תחושות, מחשבות ורעיונות. האפליקציה פותחה על ידי המרכז הטכנולוגי בבית איזי שפירא בשיתוף מעבדות SAP ישראל.
                <br /><br />
                באמצעות עיצוב בעל קו נקי ופשוט המאפשר גישה נוחה לשימוש באפליקציה עבור אנשים עם קשיים מוטוריים, האפליקציה חושפת בפני המשתמשים צוהר אל אוצר מילים וסימנים המתאים לשלבים הראשונים של התפתחות שפה ודיבור. סימנים אלו יכולים לשמש כאמצעי משמעותי לתקשורת בין אישית ויכולים לסייע לאנשים עם צרכים תקשורתיים מורכבים להביע עצמם.
                <br />
                <br />
                <bold>באפליקציה תוכלו למצוא:</bold>
                <br />
                <ul>
                    <li>
                        מעל ל- 800 סרטונים המאפשרים למידה של סימנים מתוך שפת הסימנים הישראלית.
                    </li>
                    <li>
                        כל סימן מופיע באפליקציה יחד עם מילה דבורה, מילה כתובה וסמל מוכר, מתוך מאגר הסמלים SymbolStix*, המשמש את תלמידי החינוך המיוחד להבעה במגוון אמצעי תקשורת תומכת וחליפית (תת"ח).
                    </li>
                    <li>
                        אוצר מילים מותאם לגיל הרך ולילדי בית ספר יסודי
                    </li>
                    <li>
                        הסימנים מאוגדים בקטגוריות. כל קטגוריה מתאפיינת בצבע קבוע המלווה את כל הסימנים באותה קטגוריה ומשמש כתומך ויזואלי לשימוש חוזר באפליקציה.
                    </li>
                    <li>
                        כל סרטון מציג מילה/סמל תוך שימת דגש לשלבים הראשונים של התפתחות שפה ודיבור- השלב החד מילי ושלב הצירופים ("כלב"- "כלב גדול").
                    </li>
                    <li>
                        אפשרות להוספת קטגוריות וסרטונים ושיתופם עם אחרים.
                    </li>
                </ul>
                <br />
                המרכז הטכנולוגי בבית איזי שפירא מתמחה בשימוש בטכנולוגיות מסייעת עבור אנשים עם מוגבלות, ומספק שירותי ייעוץ והדרכה לאנשי מקצוע, למשפחות ולמסגרות חינוך וטיפול. בנוסף מספק המרכז ייעוץ וליווי מקצועי לסטרטאפים ומפתחים בתחום הטכנולוגיה המסייעת.
                <br />
                <br />

                תודה מיוחדת לצוות המסור והמדהים של מעבדות SAP, ישראל, שבזכותם הגיעה האפליקציה לעולם. תודה רבה לאן ג׳ונסון- אוליס מחברת n2y, על הליווי וההכוונה בשילוב סמלי SymbolStix באפליקציה ותודה רבה ללי דן ולאלה אוחוטין על התרגום לשפת הסימנים ולעברית מסומנת.
                <br />
                <br />


            </div>
            <div className="heb" >

                <br />
                <bold>מה חדש באפליקציה:</bold>
                <br />
                <ul>
                    <li>הוספה של מעל ל- 200 סרטונים וסימנים</li>
                    <li>אוצר מילים מותאם לילדי בית ספר יסודי (בנוסף לאוצר המילים המותאם לגיל הרך)</li>
                    <li>אפשרויות עריכה מתקדמות: מנגנון להוספת מהירה של סרטונים וקטגוריות</li>
                    <li>גיבוי מידע אישי בענן של Google Drive</li>
                    <li>שיתוף קטגוריות וסרטונים</li>
                    <li>חיפוש הכולל מילים נרדפות וביטויים דומים</li>
                    <li>תיקיית "מילים שימושיות" – תיקיה עם אוצר מילים וסימנים הנמצאים בשימוש תדיר</li>
                    <li>אפשרות לתיוג סרטונים כ"מועדפים" והוספתם לתיקיית ייעודית</li>
                </ul>
                <br />
            </div >

            <br />
            <div className="info-seperator" />
            <br />
            <div className="en" >

                <bold>IssieSign</bold> IssieSign is an app for learning how to sign basic vocabulary, based on Israeli Sign Language (ISL), for the purpose of expressing needs and ideas.
                <br /> It was developed in collaboration with The Technology Center of Beit Issie Shapiro and SAP Labs Israel,
                especially for people with complex communication needs who have difficulty expressing themselves. With a simple, clear and tailor-made design allowing for easy access and navigation for people with motoric or intellectual difficulties, IssieSign can be a significant means of communication and can help people with complex communication needs express themselves more effectively.

            </div>
            <br />
            <div className="en" >
                <br />

                <bold>Unique Features:</bold>
                <br />
                <ul>

                    <li>Over 800 videos within the app </li>
                    <li>Each sign appears in the video along with the spoken word, the written word, and a familiar symbol (SymbolStix* - used in many special education schools for communication)</li>
                    <li>Vocabulary for preschool and elementary aged children</li>
                    <li>Categories are classified by color for easy recognition and efficiency</li>
                    <li>Each video is structured according to the first stages of language development - each video contains the word as a one-word stage and as a two-word stage. For example, the video for "dog" will have a clip signing "dog" followed by the sign for "big dog"/</li>
                    <li>Options to add categories, videos, and to share with others</li>
                </ul>
                <br />

            </div>
            <div className="en">
                <br />
                <bold>IssieSign</bold>, is designed to meet needs that we have identified in our work at Beit Issie Shapiro with people with disabilities. It is one of a series of apps we have created with the aim of improving participation and quality of life.
            </div>
            <div className="en">
                <br />
                The Technology Center at Beit Issie Shapiro serves as a leading hub for promoting innovation and entrepreneurship in the field of Assistive Technology (AT), bringing more accessible and affordable solutions to people with disabilities. We provide consultation and training services to families and professionals and consultation and support to developers and entrepreneurs helping them create apps and products that are accessible to a wider audience including people with disabilities.
            </div>
            <div className="en">
                <br />
                A special thanks to the dedicated staff at SAP Labs, Israel, who are responsible for bringing this app from idea to product. Thank you to Anne Johnson-Oliss, from n2y, for guidance with Symbolstix, and to Lee Dan and Ella Okhotin for the translation to Israeli Sign Language.
                <br /><br />
                Copyright SymbolStix, LLC. 2018. All rights reserved. Used with permission.
                <br /><br />
            </div>
            <div className="en" >
                <bold>What's New in This Version:</bold>
                <br />
                <ul>
                    <li>Addition of 200+ videos and symbols</li>
                    <li>New vocabulary added specific for elementary aged children, such as words related to school, classrooms, etc.</li>
                    <li>Add videos and symbols of your own easily and efficiently</li>
                    <li>Sync and backup your library using Google Drive</li>
                    <li>Sharing categories and videos with others</li>
                    <li>Search feature that allows synonyms and similar phrases</li>
                    <li>New category: Useful words - a folder where frequently used words can be saved</li>
                    <li>Tag videos as “Favorites” and manage them in a dedicated folder</li>
                </ul>
                <br />
            </div>
        </div>
    )
}

