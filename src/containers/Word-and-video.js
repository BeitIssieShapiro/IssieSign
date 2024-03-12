import React, { useEffect, useRef, useState } from "react";
import "../css/App.css";
import Card2, { ClipType } from "../components/Card2";
import Video from "./Video";
import Rope from "../components/Rope";

import { withAlert } from "react-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { translate } from "../utils/lang";
import {
  getBooleanFromString,
  headerSize,
  isLandscape,
  isMobile,
} from "../utils/Utils";

function ScrollBar({
  vertical,
  length,
  marginStartEnd,
  marginToContainer,
  pos,
}) {
  const scrollBackgroundColor = "#89775d";
  const scrollIndicatorBackgroundColor = "#443C2E";
  const thinkness = 12;

  if (vertical) {
    return (
      <div
        style={{
          position: "relative",
          height: thinkness,
          width: length,
          backgroundColor: scrollBackgroundColor,
          marginBottom: marginToContainer,
          borderRadius: 8,
          marginLeft: marginStartEnd,
          marginRight: marginStartEnd,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: pos,
            width: 50,
            height: thinkness - 2,
            borderRadius: 7,
            backgroundColor: scrollIndicatorBackgroundColor,
          }}
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          position: "relative",
          height: length,
          width: thinkness,
          backgroundColor: scrollBackgroundColor,
          marginBottom: marginStartEnd,
          marginTop: marginStartEnd,
          marginLeft: marginToContainer,
          borderRadius: 8,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: pos,
            height: 50,
            width: thinkness - 2,
            borderRadius: 7,
            backgroundColor: scrollIndicatorBackgroundColor,
          }}
        />
      </div>
    );
  }
}

function WordListAndPreview(props) {
  const scrollDivRef = useRef(null);
  const [selected, setSelected] = useState(undefined);
  const [landscapeState, setLandscapeState] = useState(isLandscape());

  const isLandscapeView = isLandscape();

  if (isLandscapeView !== landscapeState) {
    // on orientation change - swap scroll coordinates of x and y
    setLandscapeState(isLandscapeView);
    props.setScrolls(props.scroll.y, props.scroll.x);
  }

  useEffect(() => {
    if (props.pubSub && props.categoryId) {
      props.pubSub.publish({
        command: "set-categoryId",
        categoryId: props.categoryId,
      });
      props.pubSub.publish({ command: "set-themeId", themeId: props.themeId });
    }
  }, [props.pubSub, props.categoryId]);

  console.log("selected", selected);

  let wordsElements = [];
  let themeId = props.themeId;
  if (Array.isArray(props.words)) {
    wordsElements = props.words.map((word) => {
      return (
        <Card2
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
          onClick={(url) => {
            setSelected(word.name);
            props.pubSub.publish({
              command: "set-current-word",
              categoryId: props.categoryId,
              title: word.name,
              isFavorite: word.isFavorite,
            });
          }}
          key={word.id}
          cardName={word.name}
          videoName={word.videoName}
          imageName={word.imageName}
          imageName2={word.imageName2}
          themeId={themeId}
          //clipType={ClipType.None}
          clipType={
            getBooleanFromString(word.name) ? ClipType.Binder : ClipType.Clip
          }
        />
      );
    });
  }
  const headerSizeCalc = isLandscapeView
    ? isMobile()
      ? 0
      : headerSize
    : headerSize + 245;

  const scrollPos = isLandscapeView
    ? (-props.scroll?.y / scrollDivRef.current?.scrollHeight) *
    (window.innerHeight - headerSizeCalc) +
    5
    : (-props.scroll?.x / scrollDivRef.current?.scrollWidth) *
    window.innerWidth +
    5;

  const selectedWord =
    selected &&
    Array.isArray(props.words) &&
    props.words.find((w) => w.name === selected);

  const sideBarSize = isLandscapeView && (!isMobile() || !selected) ? 260 : 0;
  const favCat = FileSystem.get()
    .getCategories()
    .find((c) => c.id === FileSystem.FAVORITES_ID);

  const videoElem = selectedWord && (
    <Video
      key={"videoElem"}
      isLandscape={isLandscapeView}
      isMobile={isMobile()}
      videoName={selectedWord.userContent ? "file" : selectedWord.videoName}
      filePath={selectedWord.userContent ? selectedWord.videoName : ""}
      maxWidth={window.innerWidth - sideBarSize - 15}
      isFavorite={favCat.words.find(w => w.name === selectedWord.name && w.category === categoryId) !== undefined}
      categoryId={selectedWord.categoryId || props.categoryId}
      title={selectedWord.name}
      onFavoriteToggle={props.onFavoriteToggle}
      headerSize={headerSizeCalc}
      goBack={() => setSelected(undefined)}
    />
  );

  if (isLandscapeView && isMobile() && selected) {
    return videoElem;
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: isLandscapeView ? "row-reverse" : "column",
        overflow: "auto",
      }}
    >
      {isLandscapeView ? (
        <div
          ref={scrollDivRef}
          scroll-marker="1"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: sideBarSize,
            transform: `translateY(${props.scroll?.y || 0}px)`,
            transitionDuration: "0s",
          }}
        >
          {wordsElements.map((word, i) => (
            <div
              style={{
                maxWidth: "98%",
                minWidth: "98%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Rope size={1}>{word}</Rope>
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollDivRef}
          scroll-marker="1"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            transform: `translateX(${props.scroll?.x || 0}px)`,
            transitionDuration: "0s",
            marginBottom: 15,
          }}
        >
          <Rope size={wordsElements.length}>
            {wordsElements.map((word, i) => (
              <div
                key={i}
                style={
                  {
                    //marginTop: 30,
                    //backgroundColor: selected === word.cardName ? "blue" : undefined
                  }
                }
              >
                {word}
              </div>
            ))}
          </Rope>
        </div>
      )}
      {/**Scroll Bar */}
      <ScrollBar
        vertical={!isLandscapeView}
        length={
          isLandscapeView
            ? window.innerHeight - headerSizeCalc - 15
            : window.innerWidth - 10
        }
        marginStartEnd={5}
        marginToContainer={10}
        pos={scrollPos}
      />

      {/* <div style={{
                position: "relative", height: 12, width: window.innerWidth - 10, backgroundColor: "#89775d", marginBottom: 10,
                borderRadius: 8, marginLeft: 5, marginRight: 5
            }} >
                <div style={{
                    position: "absolute",
                    left: scrollRatio * window.innerWidth + 5,
                    width: 50, height: 10, borderRadius: 7, backgroundColor: "#443C2E"
                }} />
            </div> */}
      {/** Video */}
      <div
        style={{
          width: isLandscapeView
            ? window.innerWidth - sideBarSize - 30
            : window.innerWidth,
          position: "relative",
        }}
      >
        {selectedWord
          ? videoElem
          : wordsElements.length && (
            <div
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 45,
                color: "black",
              }}
            >
              {translate("NoWordSelected")}
            </div>
          )}
      </div>
    </div>
  );
}

export default withAlert()(WordListAndPreview);
