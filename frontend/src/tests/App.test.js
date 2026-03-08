import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Home Component', () => {
  test('renders home page', () => {
    renderWithRouter(<Home />);
    const elements = screen.getAllByText(/Transparent Aid Distribution/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('renders navigation links', () => {
    renderWithRouter(<Home />);
    const loginButtons = screen.getAllByText(/Login/i);
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  test('renders hero section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('img', { name: /Hero/i })).toBeInTheDocument();
  });

  test('renders features section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Blockchain Transparency/i)).toBeInTheDocument();
  });

  test('renders Get Started button', () => {
    renderWithRouter(<Home />);
    const buttons = screen.getAllByText(/Get Started/i);
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('renders Submit Report button', () => {
    renderWithRouter(<Home />);
    const buttons = screen.getAllByText(/Submit Report/i);
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('renders About link', () => {
    renderWithRouter(<Home />);
    const links = screen.getAllByText(/About/i);
    expect(links.length).toBeGreaterThan(0);
  });

  test('renders Features link', () => {
    renderWithRouter(<Home />);
    const links = screen.getAllByText(/Features/i);
    expect(links.length).toBeGreaterThan(0);
  });

  test('renders Contact link', () => {
    renderWithRouter(<Home />);
    const links = screen.getAllByText(/Contact/i);
    expect(links.length).toBeGreaterThan(0);
  });
});

describe('Login Component', () => {
  test('renders login form', () => {
    renderWithRouter(<Login />);
    expect(screen.getByText(/Username or Email/i)).toBeInTheDocument();
    const labels = screen.getAllByText(/Password/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  test('username input accepts text', () => {
    renderWithRouter(<Login />);
    const usernameInput = screen.getByRole('textbox');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');
  });

  test('password input accepts text', () => {
    renderWithRouter(<Login />);
    const inputs = document.querySelectorAll('input');
    const passwordInput = Array.from(inputs).find(input => input.type === 'password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('login button is present', () => {
    renderWithRouter(<Login />);
    const loginButton = screen.getByRole('button', { name: /Sign In/i });
    expect(loginButton).toBeInTheDocument();
  });
});

describe('Register Component', () => {
  test('renders registration form', () => {
    renderWithRouter(<Register />);
    expect(screen.getByRole('heading', { name: /Create account/i })).toBeInTheDocument();
  });

  test('role selection is present', () => {
    renderWithRouter(<Register />);
    expect(screen.getByText(/Role/i)).toBeInTheDocument();
    expect(screen.getByText(/Donor/i)).toBeInTheDocument();
  });

  test('email input is present', () => {
    renderWithRouter(<Register />);
    const emailInputs = screen.getAllByText(/Email/i);
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  test('register button is present', () => {
    renderWithRouter(<Register />);
    const registerButton = screen.getByRole('button', { name: /Create Account/i });
    expect(registerButton).toBeInTheDocument();
  });
});

describe('Translation System', () => {
  test('translations object exists', () => {
    const translations = require('../translations');
    expect(translations.translations).toBeDefined();
    expect(translations.translations.en).toBeDefined();
    expect(translations.translations.ar).toBeDefined();
  });

  test('English translations are complete', () => {
    const { translations } = require('../translations');
    expect(translations.en.login).toBeDefined();
    expect(translations.en.register).toBeDefined();
    expect(translations.en.dashboard).toBeDefined();
  });

  test('Arabic translations are complete', () => {
    const { translations } = require('../translations');
    expect(translations.ar.login).toBeDefined();
    expect(translations.ar.register).toBeDefined();
    expect(translations.ar.dashboard).toBeDefined();
  });

  test('English has welcome message', () => {
    const { translations } = require('../translations');
    expect(translations.en.welcomeBack).toBeDefined();
  });

  test('Arabic has welcome message', () => {
    const { translations } = require('../translations');
    expect(translations.ar.welcomeBack).toBeDefined();
  });

  test('Both languages have translations', () => {
    const { translations } = require('../translations');
    const enKeys = Object.keys(translations.en);
    const arKeys = Object.keys(translations.ar);
    expect(enKeys.length).toBeGreaterThan(300);
    expect(arKeys.length).toBeGreaterThan(300);
  });
});
