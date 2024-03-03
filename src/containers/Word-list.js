import { useEffect } from "react";

import "../css/word-list.css";
import Card2 from "../components/Card2";

export function WordList(props) {
  useEffect(() => {
    if (props.pubSub && props.categoryId) {
      props.pubSub.publish({
        command: "set-categoryId",
        categoryId: props.categoryId,
      });
      props.pubSub.publish({ command: "set-themeId", themeId: props.themeId });
    }
  }, [props.pubSub, props.categoryId]);

  return (
    <div
      scroll-marker="1"
      className={
        props.InSearch
          ? "subTileContainer wordContainer"
          : "scrollable tileContainer wordContainer"
      }
      style={{
        flexDirection: "column",
        width: "100%",
        transform: `translateX(${props.scroll?.x || 0}px) translateY(${props.scroll?.y || 0}px)`,
        transitionDuration: props.allowSwipe ? "0s" : "1.7s",
      }}
    >
      {props.words.map((word) => (
        <Card2
          key={word.id}
          asListItem={true}
          name={word.name}
          symLink={word.symLink}
          isFavorite={word.favorite}
          onFavoriteToggle={props.onFavoriteToggle}
          editMode={props.editMode}
          translate={word.translate}
          categoryId={props.categoryId}
          originalCategoryId={word.category}
          pubSub={props.pubSub}
          shareCart={props.shareCart}
          userContent={word.userContent}
          cardType={word.userContent ? "file" : "default"}
          cardName={word.name}
          videoName={word.videoName}
          imageName={word.imageName}
          imageName2={word.imageName2}
          themeId={word.themeId || props.themeId}
        />
      ))}
    </div>
  );
}
