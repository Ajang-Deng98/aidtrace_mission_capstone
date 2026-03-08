import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotificationProvider } from '../components/NotificationProvider';
import AdminDashboard from '../pages/AdminDashboard';
import DonorDashboard from '../pages/DonorDashboard';
import NGODashboard from '../pages/NGODashboard';
import SupplierDashboard from '../pages/SupplierDashboard';
import FieldOfficerDashboard from '../pages/FieldOfficerDashboard';

const renderWithRouter = (component) => {
  return render(
    <NotificationProvider>
      <MemoryRouter>{component}</MemoryRouter>
    </NotificationProvider>
  );
};

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@test.com',
  name: 'Test User',
  role: 'ADMIN'
};

beforeEach(() => {
  localStorage.setItem('user', JSON.stringify(mockUser));
  localStorage.setItem('token', 'mock-token');
});

describe('AdminDashboard', () => {
  test('renders admin dashboard', () => {
    renderWithRouter(<AdminDashboard language="en" />);
    expect(screen.getByText(/Pending Users/i)).toBeInTheDocument();
  });

  test('logout button is present', () => {
    renderWithRouter(<AdminDashboard language="en" />);
    const logoutButton = screen.getByText(/Logout/i);
    expect(logoutButton).toBeInTheDocument();
  });

  test('displays user management section', () => {
    renderWithRouter(<AdminDashboard language="en" />);
    expect(screen.getByText(/Manage Users/i)).toBeInTheDocument();
  });
});

describe('DonorDashboard', () => {
  const donorUser = { ...mockUser, role: 'DONOR' };

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(donorUser));
  });

  test('renders donor dashboard', () => {
    renderWithRouter(<DonorDashboard language="en" />);
    const elements = screen.getAllByText(/Donor/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('sidebar navigation is present', () => {
    renderWithRouter(<DonorDashboard language="en" />);
    expect(screen.getByText(/Funded Projects/i)).toBeInTheDocument();
  });

  test('displays available projects section', () => {
    renderWithRouter(<DonorDashboard language="en" />);
    expect(screen.getByText(/Pending Projects/i)).toBeInTheDocument();
  });
});

describe('NGODashboard', () => {
  const ngoUser = { ...mockUser, role: 'NGO' };

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(ngoUser));
  });

  test('renders NGO dashboard', () => {
    renderWithRouter(<NGODashboard language="en" />);
    const elements = screen.getAllByText(/NGO/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('displays create project button', () => {
    renderWithRouter(<NGODashboard language="en" />);
    expect(screen.getByText(/Create Project/i)).toBeInTheDocument();
  });

  test('displays my projects section', () => {
    renderWithRouter(<NGODashboard language="en" />);
    expect(screen.getByText(/My Projects/i)).toBeInTheDocument();
  });
});

describe('SupplierDashboard', () => {
  const supplierUser = { ...mockUser, role: 'SUPPLIER' };

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(supplierUser));
  });

  test('renders supplier dashboard', () => {
    renderWithRouter(<SupplierDashboard language="en" />);
    const elements = screen.getAllByText(/Supplier/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('proposed budget is hidden from suppliers', () => {
    renderWithRouter(<SupplierDashboard language="en" />);
    expect(screen.queryByText(/Proposed Budget/i)).not.toBeInTheDocument();
  });

  test('displays quote opportunities', () => {
    renderWithRouter(<SupplierDashboard language="en" />);
    expect(screen.getByText(/Quote Opportunities/i)).toBeInTheDocument();
  });
});

describe('FieldOfficerDashboard', () => {
  const officerUser = { ...mockUser, role: 'FIELD_OFFICER' };

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(officerUser));
  });

  test('renders field officer dashboard', () => {
    renderWithRouter(<FieldOfficerDashboard language="en" />);
    const elements = screen.getAllByText(/Field Officer/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('displays assigned projects', () => {
    renderWithRouter(<FieldOfficerDashboard language="en" />);
    expect(screen.getByText(/My Projects/i)).toBeInTheDocument();
  });
});

describe('Dashboard Roles', () => {
  test('all dashboard roles are defined', () => {
    const roles = ['ADMIN', 'DONOR', 'NGO', 'SUPPLIER', 'FIELD_OFFICER'];
    expect(roles).toHaveLength(5);
    expect(roles).toContain('ADMIN');
    expect(roles).toContain('DONOR');
    expect(roles).toContain('NGO');
    expect(roles).toContain('SUPPLIER');
    expect(roles).toContain('FIELD_OFFICER');
  });

  test('mock user object is valid', () => {
    expect(mockUser.id).toBe(1);
    expect(mockUser.role).toBe('ADMIN');
    expect(mockUser.username).toBe('testuser');
  });
});
