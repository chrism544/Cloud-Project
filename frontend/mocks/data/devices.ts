import { faker } from '@faker-js/faker';
import { Device } from '../types';

// Generate 50 realistic devices
export const devices: Device[] = Array.from({ length: 50 }, () => {
  const os = faker.helpers.arrayElement(['Windows', 'macOS', 'iOS', 'Android'] as const);
  const isCompliant = faker.datatype.boolean(0.85); // 85% compliant

  let manufacturer = '';
  let model = '';
  let osVersion = '';
  let enrollmentType: Device['enrollmentType'] = 'Unknown';

  switch (os) {
    case 'Windows':
      manufacturer = faker.helpers.arrayElement(['Dell', 'HP', 'Lenovo', 'Microsoft']);
      model = faker.helpers.arrayElement(['Latitude 5520', 'EliteBook 840', 'ThinkPad X1', 'Surface Pro 9']);
      osVersion = faker.helpers.arrayElement(['10.0.19044', '10.0.22621', '11.0.22000']);
      enrollmentType = 'WindowsAzureADJoin';
      break;
    case 'macOS':
      manufacturer = 'Apple';
      model = faker.helpers.arrayElement(['MacBook Pro 16"', 'MacBook Air 13"', 'iMac 24"', 'Mac mini']);
      osVersion = faker.helpers.arrayElement(['13.5.2', '14.0', '14.2.1']);
      enrollmentType = 'AppleUserEnrollment';
      break;
    case 'iOS':
      manufacturer = 'Apple';
      model = faker.helpers.arrayElement(['iPhone 14 Pro', 'iPhone 13', 'iPad Pro 11"', 'iPad Air']);
      osVersion = faker.helpers.arrayElement(['16.6', '17.0', '17.2']);
      enrollmentType = 'AppleUserEnrollment';
      break;
    case 'Android':
      manufacturer = faker.helpers.arrayElement(['Samsung', 'Google', 'OnePlus']);
      model = faker.helpers.arrayElement(['Galaxy S23', 'Pixel 8', 'OnePlus 11']);
      osVersion = faker.helpers.arrayElement(['13.0', '14.0']);
      enrollmentType = 'AndroidEnterprise';
      break;
  }

  return {
    id: faker.string.uuid(),
    displayName: `${manufacturer} ${model} - ${faker.person.firstName()}`,
    operatingSystem: os,
    operatingSystemVersion: osVersion,
    manufacturer,
    model,
    isCompliant,
    isManaged: faker.datatype.boolean(0.95), // 95% managed
    enrollmentType,
    lastSyncDateTime: faker.date.recent({ days: 7 }).toISOString(),
    createdDateTime: faker.date.past({ years: 1 }).toISOString(),
  };
});
