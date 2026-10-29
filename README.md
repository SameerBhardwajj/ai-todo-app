# Task Flow

A local-first task manager for Android and iOS, built with Expo, React Native, and TypeScript. It combines task planning with optional biometric app locking and an Android UPI payment demo.

## What it does

- Create, edit, complete, and delete tasks.
- Organize tasks into General, Work, Personal, Health, Study, and Errands categories.
- Add due dates and subtasks, reorder tasks, and clear completed items.
- Search the task list and filter it to all, active, or completed tasks.
- Save tasks on the device and migrate data from the previous task-storage format.
- Enable an app lock using device biometrics or the device credential when supported.
- Switch between light and dark task-screen themes.
- On Android, open an installed UPI app and keep a local payment history.

Task and payment data are stored on the device with AsyncStorage. There is no account system, remote database, or cloud synchronization in this project.

## App structure

- `src/navigation` defines the native stack and routes for Tasks, Settings, and Payments.
- `src/screens` contains the screen-level UI and connects it to feature logic.
- `src/tasks` contains the task model, normalization and filtering helpers, persistence, and task components.
- `src/auth` manages biometric availability, lock state, and the lock screen.
- `src/payments` parses UPI responses and stores payment history.
- `src/theme` and `src/utils` hold shared theme and date helpers.

The app starts at `App.tsx`, which renders `AppNavigator`. The navigator wraps the screens in the biometric-lock provider and gate.

## Run locally

Install dependencies:

```sh
npm install
```

Start the Expo development server:

```sh
npm start
```

For Android, the package script starts Expo with the development client:

```sh
npm run android
```

For iOS:

```sh
npm run ios
```

The Android command requires a development build with the project’s native modules installed. Biometric support depends on the device and its enrolled authentication methods.

## Payments

The payment screen hands a UPI payment request to an installed Android UPI app. It reads the result returned by that app and stores the amount, payee details, status, and reference locally. The screen treats unclear responses as unconfirmed.

The merchant details are configured in the payment screen source. Replace them with your own test merchant details before using the payment flow. UPI app responses are not proof of settlement; verify payments with the bank or payment provider. The payment flow is Android-only.

## Data and privacy

- Tasks, lock preferences, and payment history remain in local app storage.
- Reinstalling or clearing app data can remove locally stored records.
- Do not commit real API keys, merchant credentials, private payment details, or local `.env` files.
- Use test payment details while developing, and verify any real transaction outside the app.

## Current scope

This is a single-device app. It does not currently provide sign-in, cloud backup, cross-device sync, or a backend service.
