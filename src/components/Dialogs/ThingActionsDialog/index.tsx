import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, IconButton, Typography, ButtonGroup, ToggleButtonGroup, ToggleButton, Breadcrumbs, Switch, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { ActionType, IAction, IThing } from "../../../../types";
import ThingAction from "../../ThingAction";

export default function ThingActionsDialog(
{
  isVisible,
  thing,
  actions,
  onCancel,
  onSave,
}: {
  isVisible: boolean,
  thing: IThing | undefined,
  actions: IAction[],
  onCancel: () => void,
  onSave: () => void,
}
) {

  // const [groupName, setGroupname] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState(ActionType.count);
  const [hasStateChanged, setHasStateChanged] = useState(false);
  const [actionStates, setActionSates] = useState(actions.reduce((acc, cur) => {
    const isChecked = (thing?.actions.some(t => t.actionId === cur.actionId)) || false;
    acc[cur.actionId] = isChecked;
    return acc;
  }, {} as { [id: number]: boolean}));
    

  // const handleInputChange = (event: any) => {
  //   const newGroupname = event.target.value;
  //   setGroupname(newGroupname || '');
  // }

  const handleSaveClick = async () => {
    setSaving(true);
    // const success = await onSave(groupName);
    // setGroupname('');

    const onActions = Object.entries(actionStates).filter(([k, v]) => v).map(([key, val]) => parseInt(key));
    const actionsToSave = actions.filter(a => onActions.includes(a.actionId) && a.type === selectedActionType).map(a => a.actionId);

    const payload = {
      thingId: thing?.thingId,
      actionIds: actionsToSave
    };

    const response = await fetch('/api/action', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    const json = await response.json();

    setSaving(false);

    onSave();
  }
  
  const handleCancelClick = () => {
    onCancel();
  }

  const handleToggleCountClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
    setSelectedActionType(value);
  }

  const handleToggleOnOffClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
    setSelectedActionType(value);
  }

  return (
    <Dialog
      open={isVisible}
      onClose={handleCancelClick}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <DialogTitle id="responsive-dialog-title">
      <Box sx={{ display: "flex", alignItems: "center", margin: 0 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          <Breadcrumbs separator="/" aria-label="breadcrumb">
            <Typography key="1" color="inherit">
              ...
            </Typography>,
            <Typography key="2" color="inherit">
              {thing?.thingName}
            </Typography>,
            <Typography key="3" color="text.primary">
              Actions
            </Typography>,
          </Breadcrumbs>
        </Typography>
      </Box>

      </DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", margin: 1 }}>
          <Typography sx={{ marginRight: 1 }}>
            Action Type
          </Typography>
          <ToggleButtonGroup
            value={"count"}
            exclusive
            onChange={() => {}}
            aria-label="text alignment"
            size="small"
            color="primary"
          >
            <ToggleButton selected={selectedActionType === ActionType.count} value={ActionType.count} aria-label="left aligned" onClick={handleToggleCountClick}>
              count
            </ToggleButton>
            <ToggleButton selected={selectedActionType === ActionType.onoff} value={ActionType.onoff} aria-label="centered" onClick={handleToggleOnOffClick}>
              on/off
            </ToggleButton>
            <ToggleButton selected={selectedActionType === ActionType.segmentFeeling} value={ActionType.segmentFeeling} aria-label="centered" onClick={handleToggleOnOffClick}>
              Feeling
            </ToggleButton>
            <ToggleButton selected={selectedActionType === ActionType.segmentSize} value={ActionType.segmentSize} aria-label="centered" onClick={handleToggleOnOffClick}>
              Size
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {actions.filter(a => a.type === selectedActionType).map(action => {
          return (
            <Box key={`row-action-${action.actionId}`} sx={{ display: "flex", alignItems: "center", margin: 0 }}>
              <Box
                sx={{ flexGrow: 1, marginBottom: 1 }}
              >
                <ThingAction
                  key={`action-${action.actionId}`}
                  thing={thing as IThing} //TODO is this ok?  Do we really want to allow undefined to come in?
                  action={action}
                  color={"primary"}
                />
              </Box>
              
              <FormControlLabel
                control={<Switch checked={actionStates[action.actionId]} color="primary" />}
                label={actionStates[action.actionId] ? "show" : "hide"}
                labelPlacement="start"
                onChange={() => {
                  const newChecked = !actionStates[action.actionId];
                  setActionSates(prevStates => ({
                    ...prevStates,
                    [action.actionId]: newChecked
                  }));
                  setHasStateChanged(true);
                }}
              />
            </Box>
          )
        })}
        </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <LoadingButton
          loading={isSaving}
          variant="contained"
          onClick={handleSaveClick}
          disabled={!hasStateChanged}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}