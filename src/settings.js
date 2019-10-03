import './css/settings.css';
import React from 'react';
  
  /* MenuItem.jsx*/
  export class MenuItem extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        hover:false,
      }
    }
    
    handleHover(){
      this.setState({hover:!this.state.hover});
    }
    
    render(){
      const styles={
        container: {
          opacity: 0,
          animation: '1s appear forwards',
          animationDelay:this.props.delay,
          display: 'flex',
          alignItems:'flex-start'
        },
        menuItem:{
          fontFamily:`'Open Sans', sans-serif`,
          fontSize: '1.2rem',
          padding: '1rem 0',
          margin: '0 5%',
          cursor: 'pointer',
          color: this.state.hover? 'gray':'#fafafa',
          transition: 'color 0.2s ease-in-out',
          animation: '0.5s slideIn forwards',
          animationDelay:this.props.delay,
  
        },
        line: {
          width: '90%',
          height: '1px',
          background: 'gray',
          margin: '0 auto',
          animation: '0.5s shrink forwards',
          animationDelay:this.props.delay,
          
        }
      }
      return(
        <div style={styles.container}>
          <div 
            style={styles.menuItem} 
            onMouseEnter={()=>{this.handleHover();}} 
            onMouseLeave={()=>{this.handleHover();}}
            onClick={this.props.onClick}
          >
            <div className="info-button" ></div> 
           
            {this.props.children}  
          </div>
        
      </div>  
      )
    }
  }
  
  /* Menu.jsx */
  export class Menu extends React.Component {
    constructor(props){
      super(props);
      this.state={
        open: this.props.open? this.props.open:false,
      }
    }
    static getDerivedStateFromProps(props, state) {
      if(props.open !== state.open){
        return {open:props.open};
      }
      return null;
    }
    
    
    render(){
      const styles={
        clickCatcher: {
          position: 'absolute',
          top:0,
          bottom:0,
          left:0,
          right:0,
          zIndex: 999,
        },
        container: {
          position: 'absolute',
          top: '20%',
          left: 0,
          height: this.state.open? '80%': 0,
          width: '30%',
          minWidth: '20em',
          display: 'flex',
          flexDirection: 'column',
          background: 'black',
          opacity: 0.95,
          color: '#fafafa',
          transition: 'height 0.3s ease',
          zIndex: 1000,
        },
        menuList: {
          paddingTop: '3rem',
        }
      }
      return(
        this.state.open? 
        <div style={styles.clickCatcher} onClick={()=>{
          if (this.props.closeSettings) {
            console.log("close settings");
            this.props.closeSettings()
          }
        }}>
          <div style={styles.container} onClick={(e)=>e.stopPropagation()}>
            {
              this.state.open?
                <div style={styles.menuList} >
                  {this.props.children}
                </div>:null
            }
          </div>
        </div>:
        <div/>
      )
    }
  }
  
  /* MenuButton.jsx */
  export class MenuButton extends React.Component {
    constructor(props){
      super(props);
      this.state={
        open: this.props.open? this.props.open:false,
        color: this.props.color? this.props.color:'black',
      }
      this.handleClick = this.handleClick.bind(this);
    }
   
    static getDerivedStateFromProps(props, state) {
      if(props.open !== state.open){
        return {open:props.open};
      }
      return null;
    }
    
    handleClick() {
      this.setState({open:!this.state.open});
    }
    
    render(){
      const styles = {
        container: {
          height: '32px',
          width: '32px',
          display:'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '4px',
        },
        line: {
          height: '3px',
          width: '25px',
          background: this.state.color,
          transition: 'all 0.2s ease',
        },
        lineTop: {
          transform: this.state.open ? 'rotate(45deg)':'none',
          transformOrigin: 'top left',
          marginBottom: '5.5px',
        },
        lineMiddle: {
          opacity: this.state.open ? 0: 1,
          transform: this.state.open ? 'translateX(-16px)':'none',
        },
        lineBottom: {
          transform: this.state.open ? 'translateX(-1.5px) rotate(-45deg)':'none',
          transformOrigin: 'top left',
          marginTop: '5.5px',
        },       
      }
      return(
        <div style={styles.container} 
          onClick={this.props.onClick ? this.props.onClick: 
            ()=> {this.handleClick();}}>
          <div style={{...styles.line,...styles.lineTop}}/>
          <div style={{...styles.line,...styles.lineMiddle}}/>
          <div style={{...styles.line,...styles.lineBottom}}/>
        </div>
      )
    }
  }
  
