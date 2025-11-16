import { http, HttpResponse } from 'msw';
import { groups } from '../data/groups';
import { Group, PaginatedResponse } from '../types';

let mockGroups = [...groups];

export const groupsHandlers = [
  // List groups with pagination, sorting, and filtering
  http.get('/api/entra/groups', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '25');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'displayName';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let filtered = [...mockGroups];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.displayName.toLowerCase().includes(searchLower) ||
          g.description.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof Group];
      const bVal = b[sortBy as keyof Group];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    const response: PaginatedResponse<Group> = {
      data: paginated,
      total: filtered.length,
      page,
      limit,
    };

    return HttpResponse.json(response);
  }),

  // Get single group
  http.get('/api/entra/groups/:id', ({ params }) => {
    const group = mockGroups.find((g) => g.id === params.id);
    if (!group) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(group);
  }),

  // Create group
  http.post('/api/entra/groups', async ({ request }) => {
    const data = (await request.json()) as Partial<Group>;
    const newGroup: Group = {
      id: crypto.randomUUID(),
      displayName: data.displayName || '',
      description: data.description || '',
      groupType: data.groupType || 'Security',
      memberCount: 0,
      createdDateTime: new Date().toISOString(),
      mail: data.groupType === 'Microsoft 365' || data.groupType === 'Distribution'
        ? `${data.displayName?.replace(/\s/g, '').toLowerCase()}@contoso.com`
        : null,
    };

    mockGroups.unshift(newGroup);
    return HttpResponse.json(newGroup, { status: 201 });
  }),

  // Update group
  http.put('/api/entra/groups/:id', async ({ params, request }) => {
    const data = (await request.json()) as Partial<Group>;
    const index = mockGroups.findIndex((g) => g.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockGroups[index] = {
      ...mockGroups[index],
      ...data,
      id: mockGroups[index].id,
      createdDateTime: mockGroups[index].createdDateTime,
    };

    return HttpResponse.json(mockGroups[index]);
  }),

  // Delete group
  http.delete('/api/entra/groups/:id', ({ params }) => {
    const index = mockGroups.findIndex((g) => g.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockGroups.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
