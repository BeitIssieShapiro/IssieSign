import './css/settings.css';
import React, { useEffect, useState } from 'react';
import { getLanguage, setLanguage, translate, fTranslate } from './utils/lang';
import ModalDialog from './components/modal';
import { ADULT_MODE_KEY, ALLOW_ADD_KEY, ALLOW_SWIPE_KEY, isMyIssieSign, LANG_KEY, saveSettingKey } from './utils/Utils';
import { ButtonLogout, ButtonReconsile, RadioBtn, Spacer } from './components/ui-elements';
import FileSystem from './apis/filesystem';
import { withAlert } from 'react-alert'
import { ArrowBackIos, ArrowForwardIos, GridView, Spa, ViewList } from '@mui/icons-material';


function Settings({ onClose, state, setState, slot, showInfo, pubSub, alert }) {
  const [reload, setReload] = useState(0);
  const [email, setEmail] = useState(undefined);
  const [langSettingsMode, setLangSettingsMode] = useState(false);
  const currLanguage = getLanguage()

  useEffect(() => {
    FileSystem.whoAmI().then((res) => setEmail(res.email));
  }, [reload]);

  const reconcile = () => {
    pubSub.publish({ command: "long-process", msg: translate("SyncToCloudMsg") });
    alert.info(translate("ReconsileStarted"));
    FileSystem.get().reconsile().catch(
      (err) => alert.error(err)
    ).finally(() => {
      pubSub.publish({ command: "long-process-done" });
      setReload(prev => prev + 1)
    })
  }

  const changeLanguage = (lang) => {
    saveSettingKey(LANG_KEY, lang);
    setState({ language: lang });
    setLanguage(lang);
  }

  const adultModeChange = (e) => {
    const isOn = e.currentTarget.value === "true";
    saveSettingKey(ADULT_MODE_KEY, isOn);
    setState({ adultMode: isOn });
  }

  return <ModalDialog slot={slot} title={translate("SettingsTitle")} onClose={onClose}
    animate={true} width={Math.min(470, window.innerWidth) +"px"}
    style={{ left: 0, "--hmargin": "0", "--vmargin": "2vw", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
  >
    <div className=" settingsContainer " >
      <div onClick={showInfo} className="settings-item about">
        <div className="info-button" >i</div>
        <lbl>{translate("SettingsAbout")}</lbl>
      </div>

      <div className="settings-item">
        <lbl>{translate("SettingsSwipe")}</lbl>
        <RadioBtn className="settingsAction"
          checked={state.allowSwipe}
          onText={translate("Yes")}
          offText={translate("No")}
          onChange={(isOn) => {
            saveSettingKey(ALLOW_SWIPE_KEY, isOn);
            setState({ allowSwipe: isOn });
          }}
        />
      </div>

      <div className="settings-item">
        <lbl>
          <div>{translate("SettingsAdultMode")}</div>
          {/* <div className="settingsSubTitle">{translate("SettingsAdultModeLbl")}</div> */}
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

        </div>
      </div>

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

      {isMyIssieSign() && <div className="settings-item">
        <lbl>{translate("SettingsHideTutorial")}</lbl>
        <RadioBtn className="settingsAction"
          checked={FileSystem.get().hideTutorial}
          onText={translate("Yes")}
          offText={translate("No")}

          onChange={(isOn) => {
            FileSystem.get().setHideTutorial(isOn)
            setReload(prev => prev + 1);
          }}
        />
      </div>}
      <div className="settings-item" >
        <lbl>{translate("SettingsConnectedGDrive")}</lbl>
        <div className="conn-buttons">
          <RadioBtn className="settingsAction"
            checked={email?.length > 0}
            onChange={(isOn) => {
              if (isOn) {
                reconcile();
              } else {
                FileSystem.logout().finally(() => setReload(prev => prev + 1))
              }
              //todo
            }}
          />

          <ButtonReconsile onClick={() => reconcile()} />
        </div>
        {/* <div className="conn-buttons">
           {email?.length > 0 &&
             <ButtonLogout onClick={() => FileSystem.logout().finally(() => setReload(prev => prev + 1))} />
           } 
          
        </div> */}
      </div>

      <div className="settings-item" >
        <lbl>
          <div>{translate("SettingsLanguage")}</div>
          <div className="settingsSubTitle settings-selected">{
            currLanguage === "he" ? "עברית" :
              (currLanguage === "en" ? "English" :
                (currLanguage === "ar" ? "عربي" : "Default"))
          }</div>
        </lbl>

        <div className="settingsGroup">
          <input type="radio" id="en" name="lang" value="en" checked={currLanguage === "en"}
            onChange={(e) => changeLanguage(e.currentTarget.value)}
          />
          <label for="en">English</label>


          <input type="radio" id="ar" name="lang" value="ar" checked={currLanguage === "ar"}
            onChange={(e) => changeLanguage(e.currentTarget.value)}
          />
          <label for="en">عربي</label> {//todo

          }


          <input type="radio" id="he" name="lang" value="he" checked={currLanguage === "he" || !currLanguage}
            onChange={(e) => changeLanguage(e.currentTarget.value)}
          />
          <label for="he">עברית</label>

        </div>
        {/*option2*/}
        {/* <div className="lang-item" onClick={()=>setLangSettingsMode(true)}>
          {currLanguage === "en" ? <ArrowForwardIos style={{ fontSize: 40 }} /> : <ArrowBackIos style={{ fontSize: 40 }} />}
        </div> */}
      </div>

    </div>
  </ModalDialog>
}


export default withAlert()(Settings);

