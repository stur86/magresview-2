import './MVButton.css';

function MVButton(props) {
    const onClick = props.onClick || (() => {});
    return (<button onClick={onClick} className='mv-control mv-button'>
        {props.children}
    </button>);
}

export default MVButton;