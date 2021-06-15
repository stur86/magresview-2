import './MVButton.css';

function MVButton(props) {
    return (<button {...props} className='mv-control mv-button'>
        {props.children}
    </button>);
}

export default MVButton;