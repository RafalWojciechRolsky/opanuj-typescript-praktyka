import { type User, regularUser } from './user-model.ts';

interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

const formatName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

interface Settings {
  language: string;
  notifications: boolean;
}

interface DateOfBirth {
  getFullYear(): number;
  getMonth(): number;
  getDate(): number;
}

const formatAddress = (address: Address) => {
  return `${address.street}, ${address.city}, ${address.country} ${address.postalCode}`;
};

const isCandidateForDeletion = (role: User['role'], isActive: boolean) => {
  return role === 'guest' && !isActive;
};

const getUserLocale = (settings: Settings) => {
  return settings.language || 'en';
};

const validateAge = (dateOfBirth: DateOfBirth, minAge: number) => {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1 >= minAge;
  }

  return age >= minAge;
};

const hasPhone = (phoneNumbers: string[]) => {
  return phoneNumbers.length > 0;
};

const canSendEmailNotification = (email: string, settings: Settings) => {
  return Boolean(email) && settings.notifications;
};

formatName(regularUser.firstName, regularUser.lastName);
formatAddress(regularUser.address);
isCandidateForDeletion(regularUser.role, regularUser.isActive);
getUserLocale(regularUser.settings);
validateAge(regularUser.dateOfBirth, 18);
hasPhone(regularUser.phoneNumbers);
canSendEmailNotification(regularUser.email, regularUser.settings);
