import { cleanup, render, screen } from '@testing-library/react';
import MVIcon from './MVIcon';
import userEvent from '@testing-library/user-event';

test('render MVIcon', () => {
    render(<MVIcon icon='ms' color='#ff0000' data-testid='icon'/>);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveStyle('--path-fill: #ff0000');

    cleanup();
});