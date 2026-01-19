import React, { useState, useEffect, useRef } from 'react';
import dpsLogo from './assets/DPS.svg';
import './App.css';

type LocalityItem = {
	name: string;
	postalCode: string;
};

const API_BASE = 'https://openplzapi.org/de/Localities';

export async function fetchLocalities(query: string) {
	const url = `${API_BASE}${query}`;
	const res = await fetch(url);
	if (!res.ok) return null;
	return (await res.json()) as LocalityItem[];
}

function App() {
	const [locality, setLocality] = useState('');
	const [plz, setPlz] = useState('');
	const [availablePlzs, setAvailablePlzs] = useState<string[]>([]);
	const [error, setError] = useState('');
	const [isDropdown, setIsDropdown] = useState(false);
	const [loading, setLoading] = useState(false);

	// Debounced effect for locality -> PLZ lookup
	useEffect(() => {
		if (!locality) {
			setAvailablePlzs([]);
			setIsDropdown(false);
			return;
		}
		const timer = setTimeout(async () => {
			setLoading(true);
			setError('');
			try {
				const data = await fetchLocalities(
					`?name=${encodeURIComponent(locality)}`
				);
				if (data && data.length > 0) {
					const codes = Array.from(
						new Set(data.map((d) => d.postalCode))
					);
					if (codes.length === 1) {
						setPlz(codes[0]);
						setAvailablePlzs([]);
						setIsDropdown(false);
					} else if (codes.length > 1) {
						// populate multiple PLZ results;
						setAvailablePlzs(codes.sort());
						setIsDropdown(false);
					}
				} else {
					setError('Invalid Locality');
					setAvailablePlzs([]);
					setIsDropdown(false);
					setPlz('');
				}
			} catch (err) {
				console.error('Locality lookup failed', err);
			} finally {
				setLoading(false);
			}
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [locality]);

	// Debounced effect for PLZ -> locality lookup
	useEffect(() => {
		if (!plz || plz.length < 3) return;

		const timer = setTimeout(async () => {
			setLoading(true);
			setError('');
			try {
				const data = await fetchLocalities(
					`?postalCode=${encodeURIComponent(plz)}`
				);
				if (data && data.length > 0) {
					setLocality(data[0].name);
					setAvailablePlzs([]);
					setIsDropdown(false);
				} else {
					setError('Invalid Postal Code');
				}
			} catch (err) {
				console.error('PLZ lookup failed', err);
				setError('Invalid Postal Code');
			} finally {
				setLoading(false);
			}
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [plz]);

	// close dropdown when clicking outside the PLZ container
	const plzRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		function handleDocClick(e: MouseEvent) {
			if (!plzRef.current) return;
			if (!plzRef.current.contains(e.target as Node)) {
				setIsDropdown(false);
			}
		}
		document.addEventListener('mousedown', handleDocClick);
		return () => document.removeEventListener('mousedown', handleDocClick);
	}, []);

	const handleLocalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setLocality(val);
		setError('');
		if (val) {
			setPlz('');
			setAvailablePlzs([]);
			setIsDropdown(false);
		}
	};

	const handlePlzChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		let val = e.target.value;
		val = val.replace(/\D/g, '');
		setPlz(val);
		setError('');
		setIsDropdown(false);
		if (val) {
			setLocality('');
		}
	};

	return (
		<div className="container">
			<div className="logo-container">
				<a href="https://www.digitalproductschool.io/" target="_blank">
					<img src={dpsLogo} className="logo" alt="DPS logo" />
				</a>
			</div>

			<span className="badge">Germany Only</span>
			<h1>Address Validator</h1>
			<p className="subtitle">
				Verify localities and postal codes instantly
			</p>

			<div className="form-card">
				<div className="input-group">
					<label htmlFor="locality">Locality</label>
					<input
						id="locality"
						type="text"
						value={locality}
						onChange={handleLocalityChange}
						placeholder="e.g. München"
						autoComplete="off"
					/>
				</div>

				<div className="input-group">
					<label htmlFor="plz">Postal Code (PLZ)</label>
					<div className="plz-container" ref={plzRef}>
						<input
							id="plz"
							type="text"
							value={plz}
							onChange={handlePlzChange}
							placeholder="e.g. 80331"
							autoComplete="off"
						/>
						{/* toggle button to open PLZ dropdown when user wants to pick from results */}
						{availablePlzs.length > 0 && (
							<button
								type="button"
								aria-label="Toggle PLZ options"
								className="dropdown-toggle"
								onClick={() => setIsDropdown((s) => !s)}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7 10l5 5 5-5"
										stroke="#334155"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						)}
						{isDropdown && availablePlzs.length > 0 && (
							<ul className="custom-dropdown">
								{availablePlzs.sort().map((code) => (
									<li
										key={code}
										onClick={() => {
											setPlz(code);
											setAvailablePlzs([]);
											setIsDropdown(false);
										}}
										className={
											plz === code ? 'selected' : ''
										}
									>
										{code}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="status-area">
					{loading && (
						<div className="loading">Verifying details...</div>
					)}
					{error && (
						<div className="error">
							<span>⚠️</span> {error}
						</div>
					)}
				</div>
			</div>

			<footer className="footer">
				<p>
					Powered by <strong>Open PLZ API❤️</strong>
				</p>
			</footer>
		</div>
	);
}

export default App;
