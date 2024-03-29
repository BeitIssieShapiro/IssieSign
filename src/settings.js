import './css/settings.css';
import React, { useEffect, useState } from 'react';
import { getLanguage, setLanguage, translate, fTranslate } from './utils/lang';
import ModalDialog from './components/modal';
import {
  ADULT_MODE_KEY, ALLOW_ADD_KEY, SHOW_OWN_FOLDERS_FIRST_KEY,
  ALLOW_SWIPE_KEY, isMyIssieSign, LANG_KEY, saveSettingKey, isIssieSignArabic, AppType, WordsListMode, isElectron, isBrowser
} from './utils/Utils';
import { ButtonReconsile, RadioBtn } from './components/ui-elements';
import FileSystem from './apis/filesystem';
import { withAlert } from 'react-alert'
import { Details, GridView, ListAlt, PlaylistPlay, Swipe, Sync, SyncAlt, ViewList } from '@mui/icons-material';
import { MyIssieImg } from './components/apptype-selector'
import { ReactComponent as IssieImg } from './images/IssieSign_opt.svg'
import { createPortal } from 'react-dom';


function ToggleButtons({ title, buttons }) {
  return <div className="toggle-container">
    <div className="toggle-title">{title}</div>
    <div className="toggle-buttons" >
      {buttons.map((button, i) => <div key={i} className={"toggle-butten-container " +(button.selected ? "toggle-caption-selected" : "")}>
        <div key={i} className={"toggle-button " + (button.styleClass || "") + " " + (button.selected ? (button.selectedClass ? button.selectedClass : " toggle-selected") : "")} onClick={button.onSelect}>
          {button.icon}
        </div>
        <div>
        {button.caption}
        </div>
      </div>
      )}
    </div>
  </div>
}


function Settings({ onClose, state, setState, slot, showInfo, pubSub, alert, scroll,
  contentMap, appType, onChangeAppType, isMobile, isLandscape }) {
  const [reload, setReload] = useState(0);
  const [email, setEmail] = useState(undefined);
  //const [langSettingsMode, setLangSettingsMode] = useState(false);
  const currLanguage = getLanguage()

  const hideableCategories = contentMap.categories.filter(cat => cat.allowHide);

  useEffect(() => {
    console.log("about to call WhoAmI")
    FileSystem.whoAmI().then((res) => {
      setEmail(res.email)
      console.log("WhoAmI", res)
    })
  }, [reload]);

  const reconcile = async () => {
    pubSub.publish({ command: "long-process", msg: translate("SyncToCloudMsg") });
    alert.info(translate("ReconsileStarted"));
    return FileSystem.get().reconsile()
      .catch(
        (err) => alert.error(err)
      ).finally(() => {
        pubSub.publish({ command: "long-process-done" });
        setReload(prev => prev + 1)
      })
  }

  const sync = async () => {
    pubSub.publish({ command: "long-process", msg: translate("SyncToCloudMsg") });
    return FileSystem.get().sync(pubSub)
      .catch(
        (err) => alert.error(err)
      ).finally(() => {
        pubSub.publish({ command: "long-process-done" });
        setReload(prev => prev + 1)
      })
  }


  const connect = () => {
    FileSystem.get().findRootFolder().catch(
      (err) => alert.error(err)
    ).finally(() => setReload(prev => prev + 1));
  }

  const changeLanguage = (lang) => {
    setState({ language: lang });
    setLanguage(lang, true);
  }

  const setWordsListMode = (newMode) => {
    //const isOn = e.currentTarget.value === "true";
    saveSettingKey(WordsListMode.KEY_NAME, newMode);
    setState({ wordsListMode: newMode });
  }

  const swipeModeChange = (isOn) => {
    //const isOn = e.currentTarget.value === "true";
    saveSettingKey(ALLOW_SWIPE_KEY, isOn);
    setState({ allowSwipe: isOn });
  }

  const width = Math.min(550, window.innerWidth);

  return createPortal(<ModalDialog slot={slot} title={translate("SettingsTitle")} titleStyle={{ textAlign: "center", marginLeft: 50, fontWeight: "bold" }} onClose={onClose}
    //animate={true} 
    width={width} // + "px"}
    style={{
      top: isMobile && isLandscape ? 50 : 170,
      left: (window.innerWidth - width) / 2, "--hmargin": "0", "--vmargin": isMobile ? "1vh" : "8vh"
    }}
  >
    <div scroll-marker="1" className=" settingsContainer " style={{ transform: `translateY(${scroll?.y || 0}px)`, }}>
      <div onClick={showInfo} className="settings-item about">
        <div className="info-button" >i</div>
        <lbl>{translate("SettingsAbout")}</lbl>
      </div>


      {!isMobile && <div className="settings-item">
        <ToggleButtons
          title={translate("SettingsSwipe")}
          buttons={[
            { icon: <SyncAlt />, caption: translate("NavByArrow"), onSelect: () => swipeModeChange(false), selected: !state.allowSwipe },
            { icon: <Swipe />, caption: translate("NavBySwipe"), onSelect: () => swipeModeChange(true), selected: state.allowSwipe },
          ]}
        />
      </div>}

      <div className="settings-item">



        <ToggleButtons
          title={translate("SettingsWordsListMode")}
          buttons={[
            { icon: <GridView />, caption: translate("WordsTiles"), onSelect: () => setWordsListMode(WordsListMode.TILES), selected: state.wordsListMode == WordsListMode.TILES },
            { icon: <PlaylistPlay />, caption: translate("WordsListAndPreview"), onSelect: () => setWordsListMode(WordsListMode.LIST_AND_PREVIEW), selected: state.wordsListMode == WordsListMode.LIST_AND_PREVIEW },
            { icon: <ViewList />, caption: translate("WordsList"), onSelect: () => setWordsListMode(WordsListMode.LIST), selected: state.wordsListMode == WordsListMode.LIST },

          ]}
        />

      </div>
      {isMyIssieSign() && <div className="settings-item">
        <ToggleButtons
          title={translate("SettingsLanguage")}
          buttons={[
            { icon: <div>ע</div>, caption: "עברית", onSelect: () => changeLanguage("he"), selected: currLanguage === "he" },
            { icon: <div>E</div>, caption: "English", onSelect: () => changeLanguage("en"), selected: currLanguage === "en" },
            { icon: <div>ع</div>, caption: "عربي", onSelect: () => changeLanguage("ar"), selected: currLanguage === "ar" },
          ]}
        />

      </div>
      }
      {!isMyIssieSign() && <div className="settings-item">

        <lbl>
          <div>{translate("SettingsEdit")}</div>
          <div className="settingsSubTitle">{translate("SettingsAddCatAndWords")}</div>
        </lbl>
        <RadioBtn className="settingsAction"
          checked={state.allowAddWord}
          onText={translate("Yes")}
          offText={translate("No")}

          onChange={(isOn) => {
            saveSettingKey(ALLOW_ADD_KEY, isOn);
            setState({ allowAddWord: isOn });
            window[ALLOW_ADD_KEY] = isOn
          }}
        />
      </div>}


      {hideableCategories.map((cat, catIndex) => <div className="settings-item" key={catIndex}>
        <lbl>{fTranslate("SettingsHideFolder", cat.translate ? translate(cat.name) : cat.name)}</lbl>
        <RadioBtn className="settingsAction"
          checked={FileSystem.get().hideFolders.find(hf => cat.name === hf.name)?.hide}
          onText={translate("Yes")}
          offText={translate("No")}

          onChange={(isOn) => {
            FileSystem.get().setHideFolder(cat.name, isOn)
            setReload(prev => prev + 1);
          }}
        />
      </div>)
      }

      {!isMyIssieSign() && <div className="settings-item">

        <lbl>
          <div>{translate("ShowOwnCategoriesFirst")}</div>
        </lbl>
        <RadioBtn className="settingsAction"
          checked={state.showOwnFoldersFirst == true}
          onText={translate("Yes")}
          offText={translate("No")}

          onChange={(isOn) => {
            saveSettingKey(SHOW_OWN_FOLDERS_FIRST_KEY, isOn);
            setState({ showOwnFoldersFirst: isOn });
            window[SHOW_OWN_FOLDERS_FIRST_KEY] = isOn;
            FileSystem.get().setCustomFoldersFirst(isOn);
          }}
        />
      </div>}

      {!isElectron() && !isBrowser() && <div className="settings-item no-bottom-seperator" >
        <lbl>  {translate("SettingsConnectedGDrive")}    </lbl>

        <div className="conn-buttons">
          <RadioBtn className="settingsAction"
            checked={email?.length > 0}
            onText={translate("Yes")}
            offText={translate("No")}
            onChange={(isOn) => {
              if (isOn) {
                connect();
              } else {
                FileSystem.logout().finally(() => setReload(prev => prev + 1))
              }
            }}
          />

          <ButtonReconsile onClick={() => reconcile().then(() => sync())} />
        </div>
      </div>}
      {!isElectron() && !isBrowser() && <div className="status-item" >
        {email && <div className="settingsSubTitle settings-selected">{"מחובר " + email}</div>}
      </div>}


      {!isIssieSignArabic() && <div className="settings-item">
        <ToggleButtons
          title={translate("SettingsAppType")}
          buttons={[
            {
              icon: <IssieImg />, caption: "IssieSign", onSelect: () => onChangeAppType(AppType.IssieSign),
              selected: appType + "" == AppType.IssieSign,
              styleClass: "app-toggle-button", selectedClass: "app-toggle-button-selected"
            },
            {
              icon: <MyIssieImg />, caption: "My IssieSign", onSelect: () => onChangeAppType(AppType.MyIssieSign),
              selected: appType + "" == AppType.MyIssieSign,
              styleClass: "app-toggle-button", selectedClass: "app-toggle-button-selected"
            },
          ]}
        />

      </div>
      }

    </div>
  </ModalDialog >, document.getElementById("settings"))
}


export default withAlert()(Settings);

