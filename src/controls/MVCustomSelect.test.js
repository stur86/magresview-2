import { cleanup, render, screen } from '@testing-library/react';
import MVCustomSelect, { MVCustomSelectOption } from './MVCustomSelect';
import userEvent from '@testing-library/user-event';
import React from 'react';

test('render MVCustomSelect', () => {
    
    var value = null;
    render(<MVCustomSelect title='mv-cselect' onSelect={(v) => {value = v;}}>
        <MVCustomSelectOption value='opt1'>Option 1</MVCustomSelectOption>
        <MVCustomSelectOption value='opt2'>Option 2</MVCustomSelectOption>
        <div>Does not belong</div>
    </MVCustomSelect>);

    const cselElement = screen.getByTitle('mv-cselect');
    expect(cselElement).toBeInTheDocument();

    const mainElement = cselElement.firstChild;
    expect(mainElement).toBeInTheDocument();

    const ddownElement = mainElement.nextSibling;
    expect(ddownElement).toBeInTheDocument();

    const firstOption = ddownElement.firstChild;
    expect(firstOption).toBeInTheDocument();

    const secondOption = firstOption.nextSibling;
    expect(secondOption).toBeInTheDocument();

    const thirdOption = secondOption.nextSibling;
    expect(thirdOption).not.toBeInTheDocument();

    // Now test selecting
    userEvent.click(mainElement);
    userEvent.hover(ddownElement);

    userEvent.click(firstOption);
    expect(value).toBe('opt1');

    userEvent.click(secondOption);
    expect(value).toBe('opt2');

    // Test opening and closing
    userEvent.click(mainElement);
    expect(cselElement.classList.contains('mv-cselect-closed')).toBe(false);
    userEvent.unhover(cselElement);
    expect(cselElement.classList.contains('mv-cselect-closed')).toBe(true);    

    cleanup();
});