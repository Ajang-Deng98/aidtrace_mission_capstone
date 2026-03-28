import { openDB } from 'idb';

const DB_NAME = 'aidtrace_offline';
const DB_VERSION = 1;

export const initDB = () => openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Field officer assignments
    if (!db.objectStoreNames.contains('assignments')) {
      db.createObjectStore('assignments', { keyPath: 'id' });
    }
    // Beneficiaries per project
    if (!db.objectStoreNames.contains('beneficiaries')) {
      const store = db.createObjectStore('beneficiaries', { keyPath: 'id' });
      store.createIndex('project_id', 'project', { unique: false });
    }
    // Pre-generated OTPs for offline verification
    if (!db.objectStoreNames.contains('offline_otps')) {
      const store = db.createObjectStore('offline_otps', { keyPath: 'phone_number' });
      store.createIndex('project_id', 'project_id', { unique: false });
    }
    // Pending distributions to sync when online
    if (!db.objectStoreNames.contains('pending_distributions')) {
      db.createObjectStore('pending_distributions', { keyPath: 'local_id', autoIncrement: true });
    }
    // Pending new beneficiary registrations to sync
    if (!db.objectStoreNames.contains('pending_beneficiaries')) {
      db.createObjectStore('pending_beneficiaries', { keyPath: 'local_id', autoIncrement: true });
    }
    // Pending assignment confirmations to sync
    if (!db.objectStoreNames.contains('pending_confirmations')) {
      db.createObjectStore('pending_confirmations', { keyPath: 'local_id', autoIncrement: true });
    }
  }
});

// ── Assignments ──────────────────────────────────────────────
export const saveAssignments = async (assignments) => {
  const db = await initDB();
  const tx = db.transaction('assignments', 'readwrite');
  await Promise.all(assignments.map(a => tx.store.put(a)));
  await tx.done;
};

export const getAssignments = async () => {
  const db = await initDB();
  return db.getAll('assignments');
};

// ── Beneficiaries ─────────────────────────────────────────────
export const saveBeneficiaries = async (beneficiaries) => {
  const db = await initDB();
  const tx = db.transaction('beneficiaries', 'readwrite');
  await Promise.all(beneficiaries.map(b => tx.store.put(b)));
  await tx.done;
};

export const getBeneficiariesByProject = async (projectId) => {
  const db = await initDB();
  const all = await db.getAllFromIndex('beneficiaries', 'project_id', parseInt(projectId));
  return all;
};

export const markBeneficiaryConfirmed = async (beneficiaryId) => {
  const db = await initDB();
  const b = await db.get('beneficiaries', beneficiaryId);
  if (b) {
    b.confirmed = true;
    await db.put('beneficiaries', b);
  }
};

export const addBeneficiaryLocally = async (beneficiary) => {
  const db = await initDB();
  // Give a temporary negative ID so it doesn't clash with real IDs
  const tempId = -(Date.now());
  const record = { ...beneficiary, id: tempId, confirmed: false, face_verified: true };
  await db.put('beneficiaries', record);
  return record;
};

// ── Offline OTPs ──────────────────────────────────────────────
export const saveOfflineOTPs = async (otps) => {
  const db = await initDB();
  const tx = db.transaction('offline_otps', 'readwrite');
  await Promise.all(otps.map(o => tx.store.put(o)));
  await tx.done;
};

export const getOfflineOTP = async (phoneNumber) => {
  const db = await initDB();
  return db.get('offline_otps', phoneNumber);
};

export const clearOfflineOTPs = async (projectId) => {
  const db = await initDB();
  const all = await db.getAllFromIndex('offline_otps', 'project_id', projectId);
  const tx = db.transaction('offline_otps', 'readwrite');
  await Promise.all(all.map(o => tx.store.delete(o.phone_number)));
  await tx.done;
};

// ── Pending Distributions ─────────────────────────────────────
export const queueDistribution = async (data) => {
  const db = await initDB();
  return db.add('pending_distributions', { ...data, queued_at: new Date().toISOString() });
};

export const getPendingDistributions = async () => {
  const db = await initDB();
  return db.getAll('pending_distributions');
};

export const removePendingDistribution = async (localId) => {
  const db = await initDB();
  return db.delete('pending_distributions', localId);
};

// ── Pending Beneficiary Registrations ────────────────────────
export const queueBeneficiary = async (data) => {
  const db = await initDB();
  return db.add('pending_beneficiaries', { ...data, queued_at: new Date().toISOString() });
};

export const getPendingBeneficiaries = async () => {
  const db = await initDB();
  return db.getAll('pending_beneficiaries');
};

export const removePendingBeneficiary = async (localId) => {
  const db = await initDB();
  return db.delete('pending_beneficiaries', localId);
};

// ── Pending Assignment Confirmations ─────────────────────────
export const queueConfirmation = async (data) => {
  const db = await initDB();
  return db.add('pending_confirmations', { ...data, queued_at: new Date().toISOString() });
};

export const getPendingConfirmations = async () => {
  const db = await initDB();
  return db.getAll('pending_confirmations');
};

export const removePendingConfirmation = async (localId) => {
  const db = await initDB();
  return db.delete('pending_confirmations', localId);
};

// ── Pending count (for banner) ────────────────────────────────
export const getTotalPendingCount = async () => {
  const [d, b, c] = await Promise.all([
    getPendingDistributions(),
    getPendingBeneficiaries(),
    getPendingConfirmations()
  ]);
  return d.length + b.length + c.length;
};
