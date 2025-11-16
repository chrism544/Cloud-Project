// Data models for Entra entities

export interface User {
  id: string;
  displayName: string;
  userPrincipalName: string;
  email: string;
  department: string;
  jobTitle: string;
  officeLocation: string;
  mobilePhone: string;
  accountEnabled: boolean;
  createdDateTime: string;
  lastSignInDateTime: string | null;
}

export interface Group {
  id: string;
  displayName: string;
  description: string;
  groupType: 'Security' | 'Microsoft 365' | 'Distribution';
  memberCount: number;
  createdDateTime: string;
  mail: string | null;
}

export interface Device {
  id: string;
  displayName: string;
  operatingSystem: string;
  operatingSystemVersion: string;
  manufacturer: string;
  model: string;
  isCompliant: boolean;
  isManaged: boolean;
  enrollmentType: 'WindowsAzureADJoin' | 'AppleUserEnrollment' | 'AndroidEnterprise' | 'Unknown';
  lastSyncDateTime: string;
  createdDateTime: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
