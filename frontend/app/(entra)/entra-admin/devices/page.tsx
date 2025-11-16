'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Device, PaginatedResponse } from '@/mocks/types';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [searchText, setSearchText] = useState('');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    operatingSystem: 'Windows' as string,
    operatingSystemVersion: '',
    manufacturer: '',
    model: '',
    isCompliant: true,
    isManaged: true,
    enrollmentType: 'WindowsAzureADJoin' as Device['enrollmentType'],
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/entra/devices?page=${page + 1}&limit=${pageSize}&search=${searchText}`
      );
      const data: PaginatedResponse<Device> = await response.json();
      setDevices(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setSnackbar({ open: true, message: 'Failed to fetch devices', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [page, pageSize, searchText]);

  // Handlers
  const handleCreateClick = () => {
    setFormData({
      displayName: '',
      operatingSystem: 'Windows',
      operatingSystemVersion: '',
      manufacturer: '',
      model: '',
      isCompliant: true,
      isManaged: true,
      enrollmentType: 'WindowsAzureADJoin',
    });
    setCreateModalOpen(true);
  };

  const handleEditClick = (device: Device) => {
    setSelectedDevice(device);
    setFormData({
      displayName: device.displayName,
      operatingSystem: device.operatingSystem,
      operatingSystemVersion: device.operatingSystemVersion,
      manufacturer: device.manufacturer,
      model: device.model,
      isCompliant: device.isCompliant,
      isManaged: device.isManaged,
      enrollmentType: device.enrollmentType,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (device: Device) => {
    setSelectedDevice(device);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const response = await fetch('/api/entra/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Device registered successfully', severity: 'success' });
        setCreateModalOpen(false);
        fetchDevices();
      } else {
        throw new Error('Failed to register device');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to register device', severity: 'error' });
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedDevice) return;

    try {
      const response = await fetch(`/api/entra/devices/${selectedDevice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Device updated successfully', severity: 'success' });
        setEditModalOpen(false);
        fetchDevices();
      } else {
        throw new Error('Failed to update device');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update device', severity: 'error' });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDevice) return;

    try {
      const response = await fetch(`/api/entra/devices/${selectedDevice.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Device deleted successfully', severity: 'success' });
        setDeleteModalOpen(false);
        fetchDevices();
      } else {
        throw new Error('Failed to delete device');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete device', severity: 'error' });
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'displayName',
      headerName: 'Display Name',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'operatingSystem',
      headerName: 'OS',
      width: 100,
    },
    {
      field: 'manufacturer',
      headerName: 'Manufacturer',
      width: 150,
    },
    {
      field: 'model',
      headerName: 'Model',
      width: 180,
    },
    {
      field: 'isCompliant',
      headerName: 'Compliance',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Compliant' : 'Non-Compliant'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'isManaged',
      headerName: 'Managed',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'lastSyncDateTime',
      headerName: 'Last Sync',
      width: 180,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEditClick(params.row as Device)}
            sx={{ mr: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row as Device)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Devices
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
          Register Device
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search devices by name, OS, or manufacturer..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, width: '100%', backgroundColor: 'background.paper' }}>
        <DataGrid
          rows={devices}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          slots={{
            loadingOverlay: LinearProgress,
          }}
        />
      </Box>

      {/* Create Device Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Device</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Operating System</InputLabel>
              <Select
                value={formData.operatingSystem}
                label="Operating System"
                onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
              >
                <MenuItem value="Windows">Windows</MenuItem>
                <MenuItem value="macOS">macOS</MenuItem>
                <MenuItem value="iOS">iOS</MenuItem>
                <MenuItem value="Android">Android</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="OS Version"
              value={formData.operatingSystemVersion}
              onChange={(e) => setFormData({ ...formData, operatingSystemVersion: e.target.value })}
              fullWidth
            />
            <TextField
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              fullWidth
            />
            <TextField
              label="Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Enrollment Type</InputLabel>
              <Select
                value={formData.enrollmentType}
                label="Enrollment Type"
                onChange={(e) => setFormData({ ...formData, enrollmentType: e.target.value as any })}
              >
                <MenuItem value="WindowsAzureADJoin">Windows Azure AD Join</MenuItem>
                <MenuItem value="AppleUserEnrollment">Apple User Enrollment</MenuItem>
                <MenuItem value="AndroidEnterprise">Android Enterprise</MenuItem>
                <MenuItem value="Unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isCompliant}
                  onChange={(e) => setFormData({ ...formData, isCompliant: e.target.checked })}
                />
              }
              label="Compliant"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isManaged}
                  onChange={(e) => setFormData({ ...formData, isManaged: e.target.checked })}
                />
              }
              label="Managed"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Device Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Operating System</InputLabel>
              <Select
                value={formData.operatingSystem}
                label="Operating System"
                onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
              >
                <MenuItem value="Windows">Windows</MenuItem>
                <MenuItem value="macOS">macOS</MenuItem>
                <MenuItem value="iOS">iOS</MenuItem>
                <MenuItem value="Android">Android</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="OS Version"
              value={formData.operatingSystemVersion}
              onChange={(e) => setFormData({ ...formData, operatingSystemVersion: e.target.value })}
              fullWidth
            />
            <TextField
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              fullWidth
            />
            <TextField
              label="Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isCompliant}
                  onChange={(e) => setFormData({ ...formData, isCompliant: e.target.checked })}
                />
              }
              label="Compliant"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isManaged}
                  onChange={(e) => setFormData({ ...formData, isManaged: e.target.checked })}
                />
              }
              label="Managed"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete device "{selectedDevice?.displayName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
