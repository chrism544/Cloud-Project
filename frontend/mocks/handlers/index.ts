import { usersHandlers } from './users';
import { groupsHandlers } from './groups';
import { devicesHandlers } from './devices';

export const handlers = [
  ...usersHandlers,
  ...groupsHandlers,
  ...devicesHandlers,
];
