import { useMediaQuery } from "react-responsive";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusBadge from "./StatusBadge";

export default function ApplicationsList({ applications, onEdit, onDelete }) {
  // Below 700px wide, switch from table to stacked cards.
  // This hook re-evaluates on resize, so it's reactive, not a one-time check.
  const isMobile = useMediaQuery({ maxWidth: 700 });

  if (applications.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        No applications yet. Add your first one above.
      </Typography>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {applications.map((app) => (
          <Card key={app.id} variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <div>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {app.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.role}
                  </Typography>
                </div>
                <StatusBadge status={app.status} />
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Applied: {app.date_applied}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <IconButton size="small" onClick={() => onEdit(app)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(app.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date Applied</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id} hover>
              <TableCell>{app.company}</TableCell>
              <TableCell>{app.role}</TableCell>
              <TableCell>
                <StatusBadge status={app.status} />
              </TableCell>
              <TableCell>{app.date_applied}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(app)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(app.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
