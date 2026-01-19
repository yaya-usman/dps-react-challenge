import { describe, it, expect, vi } from 'vitest';
import { fetchLocalities } from '../App';

describe('fetchLocalities', () => {
	it('returns data when fetch is ok', async () => {
		const mockData = [{ name: 'München', postalCode: '80331' }];
		(globalThis as any).fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockData });

		const res = await fetchLocalities('?name=M%C3%BCnchen');
		expect(res).toEqual(mockData);
		expect((globalThis as any).fetch).toHaveBeenCalled();
	});

	it('returns null when response not ok', async () => {
		(globalThis as any).fetch = vi.fn().mockResolvedValue({ ok: false });
		const res = await fetchLocalities('?name=nowhere');
		expect(res).toBeNull();
	});
});
