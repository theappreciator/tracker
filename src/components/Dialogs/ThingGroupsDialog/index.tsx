import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, IconButton, Typography, ButtonGroup, ToggleButtonGroup, ToggleButton, Breadcrumbs, Link } from "@mui/material";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ActionRecord, IAction, IThing, IThingGroup } from "../../../../types";
import ThingActionsDialog from "../ThingActionsDialog";
import InputDialog from "../InputDialog";



export default function ThingGroupsDialog(
{
  isVisible,
  actions,
  thingGroup,
  onCancel,
//   onSave,
}: {
  isVisible: boolean,
  actions: IAction[],
  thingGroup: IThingGroup,
  onCancel: () => void,
//   onSave: (groupName: string) => Promise<boolean>,
}
) {

  const [selectedThing, setSelectedThing] = useState<IThing>();
  const [showNewThingDialog, setShowNewThingDialog] = useState(false);


  const [isSaving, setSaving] = useState(false);

  const saveThingName = async (thingName: string): Promise<void> => {
    const payload = {
      thingGroupId: thingGroup.groupId,
      thingName
    };

    const response = await fetch("/api/thing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    // const newGroupsAndThings: IThingGroup[] = await response.json();
    // setGroupsAndThings(newGroupsAndThings);
  }

  const handleAddThingClick = () => {
    setShowNewThingDialog(true);
  }

  const handleAddThingSave = async (groupName: string): Promise<boolean> => {
    console.log("We should save the thing", groupName);

    let success = false;
    await saveThingName(groupName)
    .then(() => {
      success = true;
    })

    if (success) {
      setShowNewThingDialog(false);
    }
    
    return success;
  }

  const handleAddThingCancel = () => {
    setShowNewThingDialog(false);
  }
  
  const handleCancelClick = () => {
    onCancel();
  }

  const handleThingDetailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const thingId = event.currentTarget.dataset.thingid;
    if (thingId) {
      const thing = thingGroup.things.find(t => t.thingId.toString() === thingId );
      if (thing) {
        setSelectedThing(thing);
      }
    }
  }

  const handleThingActionsSave = async () => {
    setSelectedThing(undefined);
  }

  const handleThingActionsCancel = () => {
    setSelectedThing(undefined);
  }

  return (
    <>
      {showNewThingDialog && (
        <InputDialog 
          isVisible={showNewThingDialog}
          onCancel={handleAddThingCancel}
          onSave={handleAddThingSave}
        />
      )}
      {selectedThing && (
        <ThingActionsDialog
          isVisible={!!selectedThing}
          thing={selectedThing}
          actions={actions}
          onCancel={handleThingActionsCancel}
          onSave={handleThingActionsSave}
        />
      )}
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
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography key="1" color="inherit">
                Groups
              </Typography>,
              <Typography key="2" color="inherit">
                {thingGroup.groupName}
              </Typography>,
              <Typography key="3" color="text.primary">
                Things
              </Typography>,
            </Breadcrumbs>
          </Typography>
          <IconButton sx={{ }} aria-label="delete" size="large" onClick={handleAddThingClick}>
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Box>

        </DialogTitle>
        <DialogContent dividers={true}>
          {thingGroup.things.map(thing => {
            return (
              <Box key={`thing-${thing.thingId}`} sx={{ display: "flex", alignItems: "center", margin: 0 }}>
                <Typography
                  sx={{ flexGrow: 1 }}
                >
                  {thing.thingName}
                </Typography>
                <IconButton sx={{ }} aria-label="delete" size="large" data-thingid={thing.thingId} onClick={handleThingDetailClick}>
                  <NavigateNextIcon fontSize="inherit" />
                </IconButton>
              </Box>
            )
          })}
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}