import { cleanup, render, screen } from '@testing-library/react';
import MVListSelect, { MVListSelectOption } from './MVListSelect';
import userEvent from '@testing-library/user-event';
import React from 'react';

test('render MVListSelect', () => {

    var value = null;

    render(<MVListSelect title='mv-lselect' onSelect={(v) => {value = v;}}>
        <MVListSelectOption value='opt1'>Option 1</MVListSelectOption>
        <MVListSelectOption value='opt2'>Option 2</MVListSelectOption>
        <div>Does not belong</div>
    </MVListSelect>);

    const lselElement = screen.getByTitle('mv-lselect');
    expect(lselElement).toBeInTheDocument();

    const firstOption = lselElement.firstChild;
    expect(firstOption).toBeInTheDocument();

    const secondOption = firstOption.nextSibling;
    expect(secondOption).toBeInTheDocument();

    const thirdOption = secondOption.nextSibling;
    expect(thirdOption).not.toBeInTheDocument();

    // Now test selecting
    userEvent.click(firstOption);

    expect(value).toBe('opt1');

    cleanup();
});