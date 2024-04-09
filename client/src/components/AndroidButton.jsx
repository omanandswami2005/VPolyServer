// AndroidButton.js


import '../styles/AndroidButton.css';
const AndroidButton = (props) => {
    
  return (
    // eslint-disable-next-line
    <a onClick={props.fun}  className={`animated-button `} style={{ backgroundColor: props.color ? props.color : '#1e1e1e',cursor:"pointer", }} >
      {props.text} {props.icon ? props.icon : ''}
    </a>
  );
}

export default AndroidButton;
