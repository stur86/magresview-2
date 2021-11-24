import { cleanup, render, screen } from '@testing-library/react';
import MVText from './MVText';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

test('renders MVText', () => {

    // Container component
    var submitted = '';
    function TestComp(props) {
        const [ state, setState ] = useState('');
        return (<MVText title='text' value={state} filter='[a-z]*' onChange={setState} onSubmit={(v) => {submitted = v;}} />);
    }

    render(<TestComp />);

    const mainElement = screen.getByTitle('text');
    const inputElement = screen.getByRole('textbox');

    userEvent.click(inputElement); // Select
    userEvent.keyboard('test');

    expect(inputElement).toHaveProperty('value', 'test');

    // Now try invalid values
    userEvent.keyboard('012@#');

    // Should not have changed
    expect(inputElement).toHaveProperty('value', 'test');

    // And finally, submission
    userEvent.keyboard('[Enter]');

    expect(submitted).toBe('test');

    cleanup();
});