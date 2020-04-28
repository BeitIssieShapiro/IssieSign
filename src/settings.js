import './css/settings.css';
import React from 'react';

export const LineMenu = () => (
  <hr
    style={{
      color: 'gray',
      backgroundColor: 'gray',
      height: 2
    }}
  />
);

export function OnOffMenu(props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column', alignItems: 'center'
    }}>
      <div style={{ height: 30 }} />
      <div style={{
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        fontSize: '25px',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <label className="form-switch">
          <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
          <i></i>
        </label>

          <div>
          {props.label}
          </div>
      </div>
      {props.subLabel ? 
        <div style={{ 
          width: '80%',
          display: 'flex',
          fontSize: '20px', 
          justifyContent:'flex-end' }}>
            { props.subLabel}
          </div> :
          null}

        
      <div style={{ height: 30 }} />
    </div>
  )
}


export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open ? this.props.open : false,
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.open !== state.open) {
      return { open: props.open };
    }
    return null;
  }


  render() {
    const styles = {
      clickCatcher: {
        position: 'absolute',
        backgroundColor: 'black',
        opacity: .5,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
      },
      container: {
        position: 'absolute',
        top: '35%',
        left: '10%',
        height: this.state.open ? 400 : 0,
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        color: '#5c7e9d',
        transition: 'height 0.3s ease',
        zIndex: 1000,
      },
      menuList: {
        paddingTop: '3rem',
      },
      header: {
        position: 'absolute',
        height: '56px',
        lineHeight: '55px',
        fontSize: 25,
        top: 0,
        width: '100%',
        background: '#f5f5f5',
        textAlign: 'center',
      },
      close: {
        position: 'absolute',
        right: 0,
        height: '56px',
        lineHeight: '55px',
        fontSize: 25,
        top: 0,
        width: '40px',
        background: '#f5f5f5',
        textAlign: 'center',
      }
    }
    return (
      this.state.open ?
        <div><div style={styles.clickCatcher} onClick={() => {
          if (this.props.closeSettings) {
            console.log("close settings");
            this.props.closeSettings()
          }
        }}></div>
          <div style={styles.container} onClick={(e) => e.stopPropagation()}>
            {
              this.state.open ?
                <div style={styles.menuList} >
                  <div style={styles.header}>הגדרות</div>
                  <div style={styles.close} onClick={() => {
                    if (this.props.closeSettings) {
                      console.log("close settings");
                      this.props.closeSettings()
                    }
                  }}>X</div>
                  <div style={{ height: 40 }} />
                  <div
                    onClick={this.props.showInfo}
                    style={{
                      marginRight: '10%',
                      marginLeft: '10%',
                      width: '80%',
                      display: 'flex',
                      fontSize: '25px',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}>
                    <div className="info-button" ></div>
                    <div>עלינו - About us</div>
                  </div>
                  <div style={{ height: 30 }} />
                  <LineMenu />
                  {this.props.children}
                </div> : null
            }
          </div>
        </div>
        :
        <div />
    )
  }
}

// /* MenuButton.jsx */
// export class MenuButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       open: this.props.open ? this.props.open : false,
//       color: this.props.color ? this.props.color : 'black',
//     }
//     this.handleClick = this.handleClick.bind(this);
//   }

//   static getDerivedStateFromProps(props, state) {
//     if (props.open !== state.open) {
//       return { open: props.open };
//     }
//     return null;
//   }

//   handleClick() {
//     this.setState({ open: !this.state.open });
//   }

//   render() {
//     const styles = {
//       container: {
//         height: '32px',
//         width: '32px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         cursor: 'pointer',
//         padding: '4px',
//       },
//       line: {
//         height: '3px',
//         width: '25px',
//         background: this.state.color,
//         transition: 'all 0.2s ease',
//       },
//       lineTop: {
//         transform: this.state.open ? 'rotate(45deg)' : 'none',
//         transformOrigin: 'top left',
//         marginBottom: '5.5px',
//       },
//       lineMiddle: {
//         opacity: this.state.open ? 0 : 1,
//         transform: this.state.open ? 'translateX(-16px)' : 'none',
//       },
//       lineBottom: {
//         transform: this.state.open ? 'translateX(-1.5px) rotate(-45deg)' : 'none',
//         transformOrigin: 'top left',
//         marginTop: '5.5px',
//       },
//     }
//     return (
//       <div style={styles.container}
//         onClick={this.props.onClick ? this.props.onClick :
//           () => { this.handleClick(); }}>
//         <div style={{ ...styles.line, ...styles.lineTop }} />
//         <div style={{ ...styles.line, ...styles.lineMiddle }} />
//         <div style={{ ...styles.line, ...styles.lineBottom }} />
//       </div>
//     )
//   }
// }

