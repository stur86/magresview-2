import { cleanup, render, screen } from '@testing-library/react';
import MVButton from './MVButton';
import userEvent from '@testing-library/user-event'

test('renders MVButton', () => {    
    var tvar = 0;
    function tinc() {
        tvar += 1;
    }
    render(<MVButton data-testid='testbutton' onClick={tinc}>
        <span data-testid='content'>Click Me</span>
    </MVButton>);
    const buttonElement = screen.getByTestId('testbutton');
    const buttonLabel = screen.getByTestId('content');

    expect(buttonElement).toBeInTheDocument();
    expect(buttonLabel).toBeInTheDocument();

    userEvent.click(buttonElement);

    expect(tvar).toBe(1);
    cleanup()

    // What if it's disabled?
    tvar = 0;
    render(<MVButton data-testid='disabled' onClick={tinc} disabled/>);
    const disabledButtonElement = screen.getByTestId('disabled');

    expect(disabledButtonElement).toBeInTheDocument();

    userEvent.click(disabledButtonElement);
    expect(tvar).toBe(0);

    cleanup();
});