import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentRecord } from './payments';

const KEY = 'payments.v1';
let pendingWrite: Promise<void> = Promise.resolve();

export async function readPayments(): Promise<PaymentRecord[]> {
  try {
    const value = await AsyncStorage.getItem(KEY);
    const records: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(records) ? records.filter((item): item is PaymentRecord =>
      item && typeof item.id === 'string' && typeof item.amount === 'string' && typeof item.createdAt === 'number'
    ) : [];
  } catch {
    return [];
  }
}

export async function writePayments(records: PaymentRecord[]): Promise<void> {
  pendingWrite = pendingWrite.then(() => AsyncStorage.setItem(KEY, JSON.stringify(records)));
  await pendingWrite;
}