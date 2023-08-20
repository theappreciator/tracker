import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";


export default function InputDialog(
{
  isVisible,
  onCancel,
  onSave,
}: {
  isVisible: boolean,
  onCancel: () => void,
  onSave: (groupName: string) => Promise<boolean>,
}
) {

  const [groupName, setGroupname] = useState('');
  const [isSaving, setSaving] = useState(false);

  const handleInputChange = (event: any) => {
    const newGroupname = event.target.value;
    setGroupname(newGroupname || '');
  }

  const handleSaveClick = async () => {
    setSaving(true);
    const success = await onSave(groupName);
    setGroupname('');
    setSaving(false);
  }
  
  const handleCancelClick = () => {
    onCancel();
  }

  return (
    <Dialog
      open={isVisible}
      onClose={handleCancelClick}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <DialogTitle>New Group Name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a new group name.  Groups will contain Things.
        </DialogContentText>
        <TextField
          autoFocus
          margin="normal"
          id="groupName"
          label="Group Name"      
          type="text"
          autoComplete={undefined}
          fullWidth
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <LoadingButton
          loading={isSaving}
          variant="contained"
          onClick={handleSaveClick}
          disabled={groupName.length === 0}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}