import {
  getPendingDistributions, removePendingDistribution,
  getPendingBeneficiaries, removePendingBeneficiary,
  getPendingConfirmations, removePendingConfirmation,
  markBeneficiaryConfirmed
} from './offlineDB';
import { fieldOfficerAPI } from '../services/api';

/**
 * Syncs all queued offline actions to the backend.
 * Returns { synced, failed } counts.
 */
export const syncOfflineData = async () => {
  let synced = 0;
  let failed = 0;

  // 1. Sync pending assignment confirmations
  const confirmations = await getPendingConfirmations();
  for (const item of confirmations) {
    try {
      await fieldOfficerAPI.confirmAssignment({
        assignment_id: item.assignment_id,
        signature: item.signature
      });
      await removePendingConfirmation(item.local_id);
      synced++;
    } catch (e) {
      console.error('Sync confirmation failed:', e);
      failed++;
    }
  }

  // 2. Sync pending beneficiary registrations
  const beneficiaries = await getPendingBeneficiaries();
  for (const item of beneficiaries) {
    try {
      await fieldOfficerAPI.addBeneficiary({
        name: item.name,
        phone_number: item.phone_number,
        project_id: item.project_id,
        face_photo: item.face_photo
      });
      await removePendingBeneficiary(item.local_id);
      synced++;
    } catch (e) {
      console.error('Sync beneficiary failed:', e);
      failed++;
    }
  }

  // 3. Sync pending distributions
  const distributions = await getPendingDistributions();
  for (const item of distributions) {
    try {
      await fieldOfficerAPI.verifyOTP({
        phone_number: item.phone_number,
        code: item.code,
        beneficiary_id: item.beneficiary_id,
        project_id: item.project_id,
        face_scan_photo: item.face_scan_photo,
        offline_sync: true
      });
      await removePendingDistribution(item.local_id);
      synced++;
    } catch (e) {
      console.error('Sync distribution failed:', e);
      failed++;
    }
  }

  return { synced, failed };
};
