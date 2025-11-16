import { faker } from '@faker-js/faker';
import { Group } from '../types';

// Generate 30 realistic groups
export const groups: Group[] = Array.from({ length: 30 }, () => {
  const displayName = faker.company.name() + ' ' + faker.helpers.arrayElement(['Team', 'Department', 'Group']);
  const groupType = faker.helpers.arrayElement(['Security', 'Microsoft 365', 'Distribution'] as const);
  const hasMail = groupType === 'Microsoft 365' || groupType === 'Distribution';

  return {
    id: faker.string.uuid(),
    displayName,
    description: faker.company.catchPhrase(),
    groupType,
    memberCount: faker.number.int({ min: 1, max: 50 }),
    createdDateTime: faker.date.past({ years: 2 }).toISOString(),
    mail: hasMail ? faker.internet.email({ firstName: displayName.replace(/\s/g, '') }).toLowerCase() : null,
  };
});
