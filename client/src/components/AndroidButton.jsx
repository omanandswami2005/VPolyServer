// AndroidButton.js


import '../styles/AndroidButton.css';
const AndroidButton = (props) => {
    
  return (
    <a onClick={props.fun} href="/" className={`animated-button `} style={{ backgroundColor: props.color ? props.color : '#1e1e1e' }} >
      {props.text} {props.icon ? props.icon : ''}
    </a>
  );
}

export default AndroidButton;
