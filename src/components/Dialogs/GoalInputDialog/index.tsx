import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Select, FormControl, InputLabel, MenuItem, Box } from "@mui/material";
import { KeyboardEventHandler, useState } from "react";

const SELECT_NULL_ENTRY = "";

export default function GoalInputDialog(
{
  isVisible,
  inputId = "stand-in-id",
  title,
  subtitle,
  label,
  prefillName = '',
  prefillGoal,
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
  prefillName?: string,
  prefillGoal?: number,
  onCancel: () => void,
  onSave: (inputId: string, inputEntry: string, selectEntry?: number) => Promise<boolean>,
  onDelete?: (inputId: string) => Promise<boolean>,
  deleteMessage?: string,
}
) {

  const [inputEntry, setInputEntry] = useState(prefillName);
  const [selectEntry, setSelectEntry] = useState(prefillGoal);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);

  const handleInputChange = (event: any) => {
    const newInputEntry = event.target.value;
    setInputEntry(newInputEntry || '');
  }

  const handleSelectChange = (event: any) => {
    const newSelectEntry = event.target.value;
    setSelectEntry(newSelectEntry || SELECT_NULL_ENTRY);
  }

  const handleSaveClick = async () => {
    setSaving(true);
    const success = await onSave(inputId, inputEntry, selectEntry);
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
          {`Delete ${prefillName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete-group-description">
            <p>{`Are you sure you want to delete ${prefillName}?`}</p>
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
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "1rem", gap: "1rem" }}>
            <FormControl sx={{ flexGrow: 1 }}>
              <TextField
                autoFocus
                id={inputId}
                label={label}      
                type="text"
                autoComplete={undefined}
                value={inputEntry}
                onChange={handleInputChange}
              />
            </FormControl>
            {prefillGoal !== undefined && (
              <FormControl sx={{ width: 120 }}>
                <InputLabel id="demo-simple-select-label">Goal</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label="Goal"
                  value={selectEntry}
                  onChange={handleSelectChange}
                >
                  <MenuItem aria-label={SELECT_NULL_ENTRY} value={0}>No Goal</MenuItem>
                  {[...Array(100)].map((_, i) => (
                    <MenuItem value={i+1}>{i + 1}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
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
            disabled={
              (inputEntry === prefillName || inputEntry.length === 0) &&
              (typeof prefillGoal !== "undefined" && selectEntry === prefillGoal)
            }
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}