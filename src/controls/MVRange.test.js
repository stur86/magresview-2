import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import MVRange from './MVRange';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

test('renders MVRange', () => {

    function TestComp(props) {
        const [value, setValue] = useState(0.0);

        return (<MVRange min={0} max={10} step={1} value={value} onChange={setValue}/>);
    }

    render(<TestComp />);

    const sliderElement = screen.getByRole('slider');
    const textElement = screen.getByRole('textbox');

    // Change from text, see if it affects the slider too
    userEvent.click(textElement);
    userEvent.keyboard('{2}[Enter]');
    expect(sliderElement).toHaveProperty('value', '2');

});