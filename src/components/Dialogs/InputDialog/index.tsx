import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { KeyboardEventHandler, useState } from "react";


export default function InputDialog(
{
  isVisible,
  inputId = "stand-in-id",
  title,
  subtitle,
  label,
  prefill = '',
  onCancel,
  onSave,
  onDelete,
  deleteMessage,
}: {
  isVisible: boolean,
  inputId?: string,
  title: string,
  subtitle: string,
  label: string,
  prefill?: string,
  onCancel: () => void,
  onSave: (inputId: string, inputEntry: string) => Promise<boolean>,
  onDelete?: (inputId: string) => Promise<boolean>,
  deleteMessage?: string,
}
) {

  const [inputEntry, setInputEntry] = useState(prefill);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);

  const handleInputChange = (event: any) => {
    const newInputEntry = event.target.value;
    setInputEntry(newInputEntry || '');
  }

  const handleSaveClick = async () => {
    setSaving(true);
    const success = await onSave(inputId, inputEntry);
    setInputEntry('');
    setSaving(false);
  }

  const handleDeleteClick = async () => {
    setDeleting(true);
    const success = await onDelete?.(inputId);
    setInputEntry('');
    setDeleting(false);
  }
  
  const handleCancelClick = () => {
    onCancel();
  }

  const handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if(event.key === "Enter"){
      if (inputEntry.length > 0) {
        handleSaveClick();
      }
   }
  }

  return (
    <>
    {showDeleteConfirmationDialog && (
      <Dialog
        open={showDeleteConfirmationDialog}
        onClose={handleCancelClick}
        aria-labelledby="alert-dialog-delete-group-title"
        aria-describedby="alert-dialog-delete-group-description"
      >
        <DialogTitle id="alert-dialog-delete-group-title">
          {`Delete ${prefill}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete-group-description">
            <p>{`Are you sure you want to delete ${prefill}?`}</p>
            {deleteMessage && <p>{deleteMessage}</p>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick}>No</Button>
          <Button color="error" variant="contained" onClick={handleDeleteClick} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      )}
      <Dialog
        open={isVisible}
        onClose={handleCancelClick}
        fullWidth={true}
        maxWidth={"sm"}
        onKeyDown={handleEnterPress}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {subtitle}
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id={inputId}
            label={label}      
            type="text"
            autoComplete={undefined}
            fullWidth
            value={inputEntry}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          {typeof onDelete === 'function' && (
            <LoadingButton
              loading={isDeleting}
              variant="contained"
              onClick={() => setShowDeleteConfirmationDialog(true)}
              disabled={false}
              color="error"
            >
              Delete
            </LoadingButton>
          )}
          <Button onClick={handleCancelClick}>Cancel</Button>
          <LoadingButton
            loading={isSaving}
            variant="contained"
            onClick={handleSaveClick}
            disabled={inputEntry === prefill || inputEntry.length === 0}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}