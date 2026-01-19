import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import App from '../App';

describe('App component', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('shows Invalid Locality when API returns no matches', async () => {
		(globalThis as any).fetch = vi
			.fn()
			.mockResolvedValue({ ok: true, json: async () => [] });

		render(<App />);

		const input = screen.getByLabelText(/Locality/i);
		const user = userEvent.setup({ delay: 0 });
		await user.type(input, 'asdasdasd');

		await waitFor(
			() =>
				expect(
					screen.getByText(/Invalid Locality/i)
				).toBeInTheDocument(),
			{ timeout: 2000 }
		);
	});

	it('fills locality when PLZ is valid', async () => {
		const mockData = [{ name: 'München', postalCode: '80331' }];
		(globalThis as any).fetch = vi
			.fn()
			.mockResolvedValue({ ok: true, json: async () => mockData });

		render(<App />);

		const plz = screen.getByLabelText(/Postal Code/i);
		const user = userEvent.setup({ delay: 0 });
		await user.type(plz, '80331');

		await waitFor(
			() =>
				expect(screen.getByDisplayValue(/München/)).toBeInTheDocument(),
			{ timeout: 2000 }
		);
	});
});
