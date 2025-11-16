import { http, HttpResponse } from 'msw';
import { users } from '../data/users';
import { User, PaginatedResponse } from '../types';

// In-memory users array for CRUD operations
let mockUsers = [...users];

export const usersHandlers = [
  // List users with pagination, sorting, and filtering
  http.get('/api/entra/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '25');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'displayName';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let filtered = [...mockUsers];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.displayName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.department.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof User];
      const bVal = b[sortBy as keyof User];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    const response: PaginatedResponse<User> = {
      data: paginated,
      total: filtered.length,
      page,
      limit,
    };

    return HttpResponse.json(response);
  }),

  // Get single user
  http.get('/api/entra/users/:id', ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  // Create user
  http.post('/api/entra/users', async ({ request }) => {
    const data = (await request.json()) as Partial<User>;
    const newUser: User = {
      id: crypto.randomUUID(),
      displayName: data.displayName || '',
      userPrincipalName: data.userPrincipalName || '',
      email: data.email || '',
      department: data.department || '',
      jobTitle: data.jobTitle || '',
      officeLocation: data.officeLocation || '',
      mobilePhone: data.mobilePhone || '',
      accountEnabled: data.accountEnabled ?? true,
      createdDateTime: new Date().toISOString(),
      lastSignInDateTime: null,
    };

    mockUsers.unshift(newUser); // Add to beginning
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // Update user
  http.put('/api/entra/users/:id', async ({ params, request }) => {
    const data = (await request.json()) as Partial<User>;
    const index = mockUsers.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      id: mockUsers[index].id, // Preserve ID
      createdDateTime: mockUsers[index].createdDateTime, // Preserve creation date
    };

    return HttpResponse.json(mockUsers[index]);
  }),

  // Delete user
  http.delete('/api/entra/users/:id', ({ params }) => {
    const index = mockUsers.findIndex((u) => u.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockUsers.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
