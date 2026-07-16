import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const STATUS_OPTIONS = ["applied", "oa", "interview", "offer", "rejected", "ghosted"];

const EMPTY_FORM = { company: "", role: "", status: "applied", notes: "" };

// `initialData` is null for "create" mode, or an existing application for "edit" mode.
// This one component handles both — the parent decides which mode by what it passes in.
export default function ApplicationForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm(initialData ? { ...initialData } : EMPTY_FORM);
  }, [initialData, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  const isEdit = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Application" : "New Application"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Company"
            value={form.company}
            onChange={handleChange("company")}
            required
            fullWidth
          />
          <TextField
            label="Role"
            value={form.role}
            onChange={handleChange("role")}
            required
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={handleChange("status")}
            fullWidth
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            value={form.notes || ""}
            onChange={handleChange("notes")}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!form.company || !form.role}
        >
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
