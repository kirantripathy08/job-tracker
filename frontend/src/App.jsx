import { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import ApplicationsList from "./components/ApplicationsList";
import ApplicationForm from "./components/ApplicationForm";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "./services/api";

export default function App() {
  const [applications, setApplications] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null); // null = create mode
  const [error, setError] = useState(null);

  const loadApplications = useCallback(async () => {
    try {
      const data = await getApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError("Could not reach the backend. Is it running on localhost:8000?");
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleAddClick = () => {
    setEditingApp(null);
    setFormOpen(true);
  };

  const handleEditClick = (app) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, formData);
      } else {
        await createApplication(formData);
      }
      setFormOpen(false);
      await loadApplications();
    } catch (err) {
      setError("Save failed. Check the backend logs.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      await loadApplications();
    } catch (err) {
      setError("Delete failed.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Job Application Tracker
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ApplicationsList
        applications={applications}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      <ApplicationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingApp}
      />
    </Container>
  );
}
