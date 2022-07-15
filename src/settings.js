import './css/settings.css';
import React, { useState } from 'react';
import { getLanguage, setLanguage, translate } from './utils/lang';
import ModalDialog from './components/modal';
import { isMyIssieSign } from './current-language';
import { ADULT_MODE_KEY, ALLOW_ADD_KEY, ALLOW_SWIPE_KEY, LANG_KEY, saveSettingKey } from './utils/Utils';
import { RadioBtn } from './components/ui-elements';
import FileSystem from './apis/filesystem';

export function Settings({ onClose, state, setState, slot, showInfo }) {
  const [reload, setReload] = useState(0);
  const currLanguage = getLanguage()

  const changeLanguage = (lang) => {
    saveSettingKey(LANG_KEY, lang);
    setState({ language: lang });
    setLanguage(lang);
  }

  return <ModalDialog slot={slot} title={translate("SettingsTitle")} onClose={onClose}>
    <div className="settingsContainer">
      <lbl onClick={showInfo} className="lblCentered">
        <div className="info-button" />
        <lbl>{translate("SettingsAbout")}</lbl>
      </lbl>

      <div />

      <lbl>{translate("SettingsSwipe")}</lbl>
      <RadioBtn className="settingsAction"
        checked={state.allowSwipe}
        onChange={(isOn) => {
          saveSettingKey(ALLOW_SWIPE_KEY, isOn);
          setState({ allowSwipe: isOn });
        }}
      />

      <lbl>
        <div>{translate("SettingsAdultMode")}</div>
        <div className="settingsSubTitle">{translate("SettingsAdultModeLbl")}</div>
        <div></div>
      </lbl>
      <RadioBtn className="settingsAction"
        checked={state.adultMode}
        onChange={(isOn) => {
          saveSettingKey(ADULT_MODE_KEY, isOn);
          setState({ adultMode: isOn });
        }}
      />

      {!isMyIssieSign &&
        <lbl>
          <div>{translate("SettingsEdit")}</div>
          <div className="settingsSubTitle">{translate("SettingsAddCatAndWords")}</div>
        </lbl>}
      {!isMyIssieSign && <RadioBtn className="settingsAction"
        checked={state.allowAddWord}
        onChange={(isOn) => {
          saveSettingKey(ALLOW_ADD_KEY, isOn);
          setState({ allowAddWord: isOn });
          window[ALLOW_ADD_KEY] = isOn
        }}
      />}

      {isMyIssieSign && <lbl>{translate("SettingsHideTutorial")}</lbl>}
      {isMyIssieSign && <RadioBtn className="settingsAction"
        checked={FileSystem.get().hideTutorial}
        onChange={(isOn) => {
          FileSystem.get().setHideTutorial(isOn)
          setReload(prev => prev + 1);
        }}
      />}

      <lbl>{translate("SettingsLanguage")}</lbl>

      <div className="settingsLanguageGroup">
        <input type="radio" id="en" name="lang" value="en" checked={currLanguage === "en"}
          onChange={(e) => changeLanguage(e.currentTarget.value)}
        />
        <label for="en">a b c</label>


        <input type="radio" id="ar" name="lang" value="ar" checked={currLanguage === "ar"}
          onChange={(e) => changeLanguage(e.currentTarget.value)}
        />
        <label for="en">أ ب ج</label>


        <input type="radio" id="he" name="lang" value="he" checked={currLanguage === "he" || !currLanguage}
          onChange={(e) => changeLanguage(e.currentTarget.value)}
        />
        <label for="he">א ב ג</label>
      </div>

    </div>
  </ModalDialog>
}



