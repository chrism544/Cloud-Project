import { http, HttpResponse } from 'msw';
import { devices } from '../data/devices';
import { Device, PaginatedResponse } from '../types';

let mockDevices = [...devices];

export const devicesHandlers = [
  // List devices with pagination, sorting, and filtering
  http.get('/api/entra/devices', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '25');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'displayName';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let filtered = [...mockDevices];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.displayName.toLowerCase().includes(searchLower) ||
          d.operatingSystem.toLowerCase().includes(searchLower) ||
          d.manufacturer.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof Device];
      const bVal = b[sortBy as keyof Device];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return sortOrder === 'asc'
          ? (aVal === bVal ? 0 : aVal ? 1 : -1)
          : (aVal === bVal ? 0 : aVal ? -1 : 1);
      }

      return 0;
    });

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    const response: PaginatedResponse<Device> = {
      data: paginated,
      total: filtered.length,
      page,
      limit,
    };

    return HttpResponse.json(response);
  }),

  // Get single device
  http.get('/api/entra/devices/:id', ({ params }) => {
    const device = mockDevices.find((d) => d.id === params.id);
    if (!device) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(device);
  }),

  // Create device (register new device)
  http.post('/api/entra/devices', async ({ request }) => {
    const data = (await request.json()) as Partial<Device>;
    const newDevice: Device = {
      id: crypto.randomUUID(),
      displayName: data.displayName || '',
      operatingSystem: data.operatingSystem || 'Windows',
      operatingSystemVersion: data.operatingSystemVersion || '10.0.19044',
      manufacturer: data.manufacturer || 'Unknown',
      model: data.model || 'Unknown',
      isCompliant: data.isCompliant ?? false,
      isManaged: data.isManaged ?? false,
      enrollmentType: data.enrollmentType || 'Unknown',
      lastSyncDateTime: new Date().toISOString(),
      createdDateTime: new Date().toISOString(),
    };

    mockDevices.unshift(newDevice);
    return HttpResponse.json(newDevice, { status: 201 });
  }),

  // Update device
  http.put('/api/entra/devices/:id', async ({ params, request }) => {
    const data = (await request.json()) as Partial<Device>;
    const index = mockDevices.findIndex((d) => d.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockDevices[index] = {
      ...mockDevices[index],
      ...data,
      id: mockDevices[index].id,
      createdDateTime: mockDevices[index].createdDateTime,
    };

    return HttpResponse.json(mockDevices[index]);
  }),

  // Delete device
  http.delete('/api/entra/devices/:id', ({ params }) => {
    const index = mockDevices.findIndex((d) => d.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockDevices.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
