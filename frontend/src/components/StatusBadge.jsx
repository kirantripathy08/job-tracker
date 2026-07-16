import Chip from "@mui/material/Chip";

// Maps each status to a MUI Chip color. Centralizing this mapping means
// the color logic lives in one place, not copy-pasted everywhere a status shows up.
const STATUS_COLORS = {
  applied: "default",
  oa: "info",
  interview: "warning",
  offer: "success",
  rejected: "error",
  ghosted: "default",
};

export default function StatusBadge({ status }) {
  return (
    <Chip
      label={status}
      color={STATUS_COLORS[status] || "default"}
      size="small"
      sx={{ textTransform: "capitalize" }}
    />
  );
}
