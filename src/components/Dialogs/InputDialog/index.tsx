import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { KeyboardEventHandler, useState } from "react";


export default function InputDialog(
{
  isVisible,
  title,
  subtitle,
  label,
  onCancel,
  onSave,
}: {
  isVisible: boolean,
  title: string,
  subtitle: string,
  label: string,
  onCancel: () => void,
  onSave: (inputEntry: string) => Promise<boolean>,
}
) {

  const [inputEntry, setInputEntry] = useState('');
  const [isSaving, setSaving] = useState(false);

  const handleInputChange = (event: any) => {
    const newInputEntry = event.target.value;
    setInputEntry(newInputEntry || '');
  }

  const handleSaveClick = async () => {
    setSaving(true);
    const success = await onSave(inputEntry);
    setInputEntry('');
    setSaving(false);
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
          id="inputEntry"
          label={label}      
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
          disabled={inputEntry.length === 0}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}