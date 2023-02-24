import './css/settings.css';
import React, { useEffect, useState } from 'react';
import { getLanguage, setLanguage, translate, fTranslate } from './utils/lang';
import ModalDialog from './components/modal';
import { ADULT_MODE_KEY, ALLOW_ADD_KEY, ALLOW_SWIPE_KEY, isMyIssieSign, LANG_KEY, saveSettingKey } from './utils/Utils';
import { ButtonReconsile, RadioBtn } from './components/ui-elements';
import FileSystem from './apis/filesystem';
import { withAlert } from 'react-alert'
import { GridView, Swipe, SyncAlt, ViewList } from '@mui/icons-material';
import { mainJson } from './mainJson';


function ToggleButtons({ title, buttons }) {
  return <div className="toggle-container">
    <div className="toggle-title">{title}</div>
    <div className="toggle-buttons">
      {buttons.map((button, i) => <div key={i} className={button.selected ? "toggle-caption-selected" : ""}>
        <div key={i} className={"toggle-button" + (button.selected ? " toggle-selected" : "")} onClick={button.onSelect}>
          {button.icon}
        </div>
        {button.caption}
      </div>
      )}
    </div>
  </div>
}


function Settings({ onClose, state, setState, slot, showInfo, pubSub, alert, scroll }) {
  const [reload, setReload] = useState(0);
  const [email, setEmail] = useState(undefined);
  //const [langSettingsMode, setLangSettingsMode] = useState(false);
  const currLanguage = getLanguage()

  const hideableCategories = mainJson.categories.filter(cat => cat.allowHide);


  useEffect(() => {
    FileSystem.whoAmI().then((res) => setEmail(res.email));
  }, [reload]);

  const reconcile = () => {
    pubSub.publish({ command: "long-process", msg: translate("SyncToCloudMsg") });
    alert.info(translate("ReconsileStarted"));
    FileSystem.get().reconsile()
      .catch(
        (err) => alert.error(err)
      ).finally(() => {
        pubSub.publish({ command: "long-process-done" });
        setReload(prev => prev + 1)
      })
  }

  const connect = () => {
    FileSystem.get().findRootFolder().then(
      () => setReload(prev => prev + 1),
      (err) => alert.error(err)
    )
  }

  const changeLanguage = (lang) => {
    saveSettingKey(LANG_KEY, lang);
    setState({ language: lang });
    setLanguage(lang);
  }

  const adultModeChange = (isOn) => {
    //const isOn = e.currentTarget.value === "true";
    saveSettingKey(ADULT_MODE_KEY, isOn);
    setState({ adultMode: isOn });
  }

  const swipeModeChange = (isOn) => {
    //const isOn = e.currentTarget.value === "true";
    saveSettingKey(ALLOW_SWIPE_KEY, isOn);
    setState({ allowSwipe: isOn });
  }

  const width = Math.min(550, window.innerWidth);

  return <ModalDialog slot={slot} title={translate("SettingsTitle")} titleStyle={{ textAlign: "center", marginLeft: 50, fontWeight:"bold" }} onClose={onClose}
    //animate={true} 
    width={width} // + "px"}
    style={{ top: 170, left: (window.innerWidth - width) / 2, "--hmargin": "0", "--vmargin": "8vw" }}
  >
    <div scroll-marker="1" className=" settingsContainer " style={{ transform: `translateY(${scroll?.y || 0}px)`, }}>
      <div onClick={showInfo} className="settings-item about">
        <div className="info-button" >i</div>
        <lbl>{translate("SettingsAbout")}</lbl>
      </div>


      <div className="settings-item">
        {/* <lbl>
          <div>{translate("SettingsSwipe")}</div>
        </lbl>

        <div className="settingsGroup">
          <input type="radio" id="off" name="navMode" value={false} checked={!state.allowSwipe}
            onChange={swipeModeChange}
          />
          <label for="off">
            <SyncAlt />
            {translate("NavByArrow")}
          </label>
          <input type="radio" id="on" name="navMode" value={true} checked={state.allowSwipe}
            onChange={swipeModeChange}
          />
          <label for="on">
            <Swipe />
            {translate("NavBySwipe")}
          </label>

        </div> */}
        <ToggleButtons
          title={translate("SettingsSwipe")}
          buttons={[
            { icon: <SyncAlt />, caption: translate("NavByArrow"), onSelect: () => swipeModeChange(false), selected: !state.allowSwipe },
            { icon: <Swipe />, caption: translate("NavBySwipe"), onSelect: () => swipeModeChange(true), selected: state.allowSwipe },
          ]}
        />
      </div>

      <div className="settings-item">
        {/* <lbl>
          <div>{translate("SettingsAdultMode")}</div>
           <div className="settingsSubTitle">{translate("SettingsAdultModeLbl")}</div> 
        </lbl>

        <div className="settingsGroup">


          <input type="radio" id="off" name="adultMode" value={false} checked={!state.adultMode}
            onChange={adultModeChange}
          />
          <label for="off">
            <GridView />
            {translate("AdultModeOff")}
          </label>
          <input type="radio" id="on" name="adultMode" value={true} checked={state.adultMode}
            onChange={adultModeChange}
          />
          <label for="on">
            <ViewList />
            {translate("AdultModeOn")}
          </label>
        </div> */}


        <ToggleButtons
          title={translate("SettingsAdultMode")}
          buttons={[
            { icon: <GridView />, caption: translate("AdultModeOff"), onSelect: () => adultModeChange(false), selected: !state.adultMode },
            { icon: <ViewList />, caption: translate("AdultModeOn"), onSelect: () => adultModeChange(true), selected: state.adultMode },
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
      <div className="settings-item no-bottom-seperator" >
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

          <ButtonReconsile onClick={() => reconcile()} />
        </div>
      </div>
      <div className="status-item" >
        {email && <div className="settingsSubTitle settings-selected">{"מחובר " + email}</div>}
      </div>

      
    </div>
  </ModalDialog >
}


export default withAlert()(Settings);

