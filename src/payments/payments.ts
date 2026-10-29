export type PaymentStatus = 'success' | 'failed' | 'unknown';

export type PaymentRecord = {
  id: string;
  amount: string;
  payee: string;
  upiId: string;
  status: PaymentStatus;
  reference: string | null;
  createdAt: number;
};

export function parseUpiResponse(response?: string): Pick<PaymentRecord, 'status' | 'reference'> {
  const values = new URLSearchParams((response ?? '').replace(/^\?/, ''));
  const status = values.get('Status') ?? values.get('status') ?? '';
  return {
    status: /^success$/i.test(status) ? 'success' : /^failure|failed|submitted$/i.test(status) ? 'failed' : 'unknown',
    reference: values.get('txnId') ?? values.get('transactionId') ?? values.get('ApprovalRefNo') ?? null,
  };
}