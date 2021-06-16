import { cleanup, render, screen } from '@testing-library/react';
import MVCheckBox from './MVCheckBox';
import userEvent from '@testing-library/user-event';

test('renders MVCheckBox', () => {

    var checked = true;
    var count = 0;
    render(<MVCheckBox title='cbox' checked={checked} onCheck={() => {count += 1;}}>
        <span data-testid='label'>CheckBox Label</span>
    </MVCheckBox>);

    const checkBoxElement = screen.getByTitle('cbox');
    const checkLabelElement = screen.getByTestId('label');
    const inputElement = screen.getByRole('checkbox');

    expect(checkBoxElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
    expect(checkLabelElement).toBeInTheDocument();

    userEvent.click(inputElement);
    expect(inputElement).toHaveProperty('checked', false);

    userEvent.click(inputElement);
    expect(inputElement).toHaveProperty('checked', true);

    expect(count).toBe(2);

    cleanup();
});