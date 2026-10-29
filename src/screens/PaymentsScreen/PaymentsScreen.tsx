import { useCallback, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as IntentLauncher from 'expo-intent-launcher';

import { RootStackParamList } from '../../navigation/types';
import { PaymentRecord, parseUpiResponse } from '../../payments/payments';
import { readPayments, writePayments } from '../../payments/storage';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Payments'>;
const field = { borderWidth: 1, borderColor: '#dfe3f2', borderRadius: 12, padding: 13, marginTop: 10, color: '#111827', backgroundColor: '#fff' } as const;
const MERCHANT_NAME = 'Example Merchant';
const MERCHANT_UPI_ID = 'merchant@example';
const formatPaymentDateTime = (timestamp: number) => new Intl.DateTimeFormat('en-IN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
}).format(timestamp);

export function PaymentsScreen() {
  const navigation = useNavigation<Navigation>();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('Payment');
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => setRecords(await readPayments()), []);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const pay = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert('Check payment details', 'Enter a valid amount greater than zero.');
      return;
    }
    if (Platform.OS !== 'android') {
      Alert.alert('Android required', 'UPI app intents are available on Android devices.');
      return;
    }

    setBusy(true);
    const createdAt = Date.now();
    try {
      const params = new URLSearchParams({ pa: MERCHANT_UPI_ID, pn: MERCHANT_NAME, am: value.toFixed(2), cu: 'INR', tn: note.trim() || 'Payment' });
      const result = await IntentLauncher.startActivityAsync('android.intent.action.VIEW', { data: `upi://pay?${params.toString()}` });
      const parsed = parseUpiResponse(result.data);
      const record: PaymentRecord = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        amount: value.toFixed(2), payee: MERCHANT_NAME, upiId: MERCHANT_UPI_ID, ...parsed, createdAt,
      };
      const updated = [record, ...await readPayments()];
      setRecords(updated);
      await writePayments(updated);
      console.log('record ', record)
      Alert.alert(
        record.status === 'success' ? 'Payment reported successful' : record.status === 'failed' ? 'Payment failed' : 'Payment result not confirmed',
        record.status === 'unknown' ? 'The UPI app did not return a clear status. Check your bank or UPI app before trying again.' : `₹${record.amount} · ${record.payee}${record.reference ? `\nReference: ${record.reference}` : ''}`,
      );
    } catch (error) {
      Alert.alert('Could not open UPI app', error instanceof Error ? error.message : 'No compatible payment app may be installed.');
    } finally {
      setBusy(false);
      await refresh();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eef4ff' }}>
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.goBack()}><Text style={{ color: '#635bff', fontSize: 16 }}>‹ Back</Text></TouchableOpacity>
        <Text style={{ color: '#111827', fontSize: 28, fontWeight: '800', marginTop: 18 }}>Payments</Text>
        <Text style={{ color: '#64748b', marginTop: 6 }}>Continue in any installed UPI app. Confirm payment status in your bank app.</Text>
        <TextInput accessibilityLabel="Amount in rupees" keyboardType="decimal-pad" onChangeText={setAmount} placeholder="Amount (₹)" style={field} value={amount} />
        <View style={{ ...field, paddingVertical: 12 }}><Text style={{ color: '#64748b', fontSize: 12 }}>Merchant</Text><Text style={{ color: '#111827', fontWeight: '600', marginTop: 4 }}>{MERCHANT_NAME}</Text></View>
        <View style={{ ...field, paddingVertical: 12 }}><Text style={{ color: '#64748b', fontSize: 12 }}>UPI ID</Text><Text style={{ color: '#111827', fontWeight: '600', marginTop: 4 }}>{MERCHANT_UPI_ID}</Text></View>
        <TextInput accessibilityLabel="Payment note" onChangeText={setNote} placeholder="Payment note" style={field} value={note} />
        <TouchableOpacity accessibilityRole="button" disabled={busy} onPress={() => void pay()} style={{ marginTop: 14, backgroundColor: '#635bff', borderRadius: 14, padding: 16, alignItems: 'center', opacity: busy ? 0.6 : 1 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{busy ? 'Waiting for payment app…' : 'Continue to UPI app'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#64748b', fontSize: 12, marginTop: 10 }}>A UPI app response is not proof of settlement. Verify with your payment provider before fulfilling an order.</Text>

        <Text style={{ color: '#111827', fontSize: 21, fontWeight: '700', marginTop: 28, marginBottom: 10 }}>Payment history</Text>
        {records.length === 0 ? <Text style={{ color: '#64748b' }}>No payments yet.</Text> : records.map((record) => (
          <View key={record.id} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 15, marginBottom: 10 }}>
            <Text style={{ color: '#111827', fontWeight: '700', fontSize: 17 }}>₹{record.amount} · {record.payee}</Text>
            <Text style={{ color: '#64748b', marginTop: 5 }}>{record.upiId} · {formatPaymentDateTime(record.createdAt)}</Text>
            <Text style={{ color: record.status === 'success' ? '#15803d' : record.status === 'failed' ? '#b91c1c' : '#b45309', marginTop: 7, fontWeight: '600' }}>Status: {record.status === 'unknown' ? 'Unconfirmed' : record.status}</Text>
            {record.reference ? <Text style={{ color: '#64748b', marginTop: 4 }}>Reference: {record.reference}</Text> : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}