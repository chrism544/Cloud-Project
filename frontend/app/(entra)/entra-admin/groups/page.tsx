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
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Group, PaginatedResponse } from '@/mocks/types';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [searchText, setSearchText] = useState('');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    groupType: 'Security' as 'Security' | 'Microsoft 365' | 'Distribution',
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch groups
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/entra/groups?page=${page + 1}&limit=${pageSize}&search=${searchText}`
      );
      const data: PaginatedResponse<Group> = await response.json();
      setGroups(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setSnackbar({ open: true, message: 'Failed to fetch groups', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [page, pageSize, searchText]);

  // Handlers
  const handleCreateClick = () => {
    setFormData({
      displayName: '',
      description: '',
      groupType: 'Security',
    });
    setCreateModalOpen(true);
  };

  const handleEditClick = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      displayName: group.displayName,
      description: group.description,
      groupType: group.groupType,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const response = await fetch('/api/entra/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Group created successfully', severity: 'success' });
        setCreateModalOpen(false);
        fetchGroups();
      } else {
        throw new Error('Failed to create group');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create group', severity: 'error' });
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedGroup) return;

    try {
      const response = await fetch(`/api/entra/groups/${selectedGroup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Group updated successfully', severity: 'success' });
        setEditModalOpen(false);
        fetchGroups();
      } else {
        throw new Error('Failed to update group');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update group', severity: 'error' });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedGroup) return;

    try {
      const response = await fetch(`/api/entra/groups/${selectedGroup.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Group deleted successfully', severity: 'success' });
        setDeleteModalOpen(false);
        fetchGroups();
      } else {
        throw new Error('Failed to delete group');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete group', severity: 'error' });
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
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'groupType',
      headerName: 'Type',
      width: 150,
    },
    {
      field: 'memberCount',
      headerName: 'Members',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdDateTime',
      headerName: 'Created',
      width: 180,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
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
            onClick={() => handleEditClick(params.row as Group)}
            sx={{ mr: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row as Group)}
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
          Groups
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
          New Group
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search groups by name or description..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, width: '100%', backgroundColor: 'background.paper' }}>
        <DataGrid
          rows={groups}
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

      {/* Create Group Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Group Type</InputLabel>
              <Select
                value={formData.groupType}
                label="Group Type"
                onChange={(e) => setFormData({ ...formData, groupType: e.target.value as any })}
              >
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Microsoft 365">Microsoft 365</MenuItem>
                <MenuItem value="Distribution">Distribution</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Group Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Group</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Group Type</InputLabel>
              <Select
                value={formData.groupType}
                label="Group Type"
                onChange={(e) => setFormData({ ...formData, groupType: e.target.value as any })}
              >
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Microsoft 365">Microsoft 365</MenuItem>
                <MenuItem value="Distribution">Distribution</MenuItem>
              </Select>
            </FormControl>
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
        <DialogTitle>Delete Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete group "{selectedGroup?.displayName}"? This action cannot be undone.
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
