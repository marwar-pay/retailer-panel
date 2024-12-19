
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const TicketDetailModal = ({ open, onClose, ticket }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ticket Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Ticket ID: {ticket.ticketId}</Typography>
        <Typography variant="body1">Subject: {ticket.subject}</Typography>
        <Typography variant="body1">Related To: {ticket.relatedTo}</Typography>
        <Typography variant="body1">Last Update: {ticket.lastUpdate}</Typography>
        <Typography variant="body1">Status: {ticket.status}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDetailModal;
