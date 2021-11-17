import { cleanup, render, screen } from '@testing-library/react';
import MVCustomSelect, { MVCustomSelectOption } from './MVCustomSelect';
import userEvent from '@testing-library/user-event';
import React from 'react';

test('render MVCustomSelect', () => {
    var value = null;
    render(<MVCustomSelect title='mv-cselect' onSelect={(v) => {value = v;}}>
        <MVCustomSelectOption value='opt1'>Option 1</MVCustomSelectOption>
        <MVCustomSelectOption value='opt2'>Option 2</MVCustomSelectOption>
    </MVCustomSelect>);

    const cselElement = screen.getByTitle('mv-cselect');
    expect(cselElement).toBeInTheDocument();

    const mainElement = cselElement.firstChild;
    expect(mainElement).toBeInTheDocument();

    const ddownElement = mainElement.nextSibling;
    expect(ddownElement).toBeInTheDocument();

    // Now test selecting
    userEvent.click(mainElement);
    userEvent.hover(ddownElement);
    userEvent.click(ddownElement.firstChild);

    expect(value).toBe('opt1');

    cleanup();
});