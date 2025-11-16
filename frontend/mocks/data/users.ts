import { faker } from '@faker-js/faker';
import { User } from '../types';

// Generate 100 realistic users
export const users: User[] = Array.from({ length: 100 }, () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const displayName = `${firstName} ${lastName}`;
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const createdDate = faker.date.past({ years: 2 });

  return {
    id: faker.string.uuid(),
    displayName,
    userPrincipalName: email,
    email,
    department: faker.helpers.arrayElement([
      'Engineering',
      'Marketing',
      'Sales',
      'Human Resources',
      'Finance',
      'Operations',
      'IT',
      'Legal',
      'Customer Support',
      'Product',
    ]),
    jobTitle: faker.person.jobTitle(),
    officeLocation: faker.location.city(),
    mobilePhone: faker.phone.number(),
    accountEnabled: faker.datatype.boolean(0.9), // 90% enabled
    createdDateTime: createdDate.toISOString(),
    lastSignInDateTime: faker.datatype.boolean(0.8)
      ? faker.date.recent({ days: 30 }).toISOString()
      : null,
  };
});
