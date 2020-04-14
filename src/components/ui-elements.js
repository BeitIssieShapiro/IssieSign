import React from 'react';
import '../css/ui-elements.css';

export function PlusButton(props) {
    const styles = {
        container: {
          marginTop:3,
          marginLeft:10,
          height: '32px',
          width: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '4px',
        },
        line: {
          height: '3px',
          width: '18px',
        },
        vertical: {
          transform: 'translate(0,-3px) rotate(90deg)',
        }
    }
    return (
        <div style={styles.container} onClick={props.onClick}>
          <div style={{ ...styles.line, background: props.color}} />
          <div style={{ ...styles.line, ...styles.vertical, background: props.color }} />
        </div>);
    
}

export function SettingsButton (props) {
    return <div className="settings-button" onClick={props.onClick}></div>
}

export function TrashButton (props) {
  return <div className="trash-button" {...props}></div>
}

export function BackButton (props) {
  return <div className="back-button" {...props}></div>
}

export function PrevButton (props) {
  return <div className="prev-button" {...props}></div>
}

export function NextButton (props) {
  return <div className="next-button" {...props}></div>
}


export function ShareButton (props) {
  return <div className="share-button" {...props}></div>
}

export function AttachButton (props) {
    return <div className="attach-button" onClick={props.onClick}></div>
}

export function Selected (props) {
  return <div className="selected-icon"></div>
}
