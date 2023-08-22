import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, IconButton, Typography, ButtonGroup, ToggleButtonGroup, ToggleButton, Breadcrumbs, Link } from "@mui/material";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IAction, IThing, IThingGroup } from "../../../../types";
import ThingActionsDialog from "../ThingActionsDialog";
import InputDialog from "../InputDialog";
import ListDialog, { GroupRowItem, HeaderItem, RowItem } from "../ListDialog";
import { useGlobalContext } from "../../../context";



export default function ThingGroupsDialog(
{
  isVisible,
  actions,
  thingGroup,
  onClose,
//   onSave,
}: {
  isVisible: boolean,
  actions: IAction[],
  thingGroup: IThingGroup,
  onClose: () => void,
//   onSave: (groupName: string) => Promise<boolean>,
}
) {

  const [selectedThing, setSelectedThing] = useState<IThing>();
  const [showNewThingDialog, setShowNewThingDialog] = useState(false);
  const { setNeedsReload } = useGlobalContext();


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

    setNeedsReload(true);
  }

  const handleAddThingClick = () => {
    setShowNewThingDialog(true);
  }

  const handleAddThingSave = async (groupName: string): Promise<boolean> => {
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
  
  const handleCloseClick = () => {
    onClose();
  }

  const handleThingDetailClick = (rowItem: RowItem) => {
    const thing = thingGroup.things.find(t => t.thingId.toString() === rowItem.id);
    if (thing) {
      setSelectedThing(thing);
    }
  }

  const handleThingActionsSave = async () => {
    setSelectedThing(undefined);
    setNeedsReload(true);
    onClose();
  }

  const handleThingActionsCancel = () => {
    setSelectedThing(undefined);
  }

  const rowItems: RowItem[] = thingGroup.things.map(thing => {
    return {
      id: thing.thingId.toString(),
      leftText: thing.thingName,
      rightText: `${thing.actions.length} Actions`,
      onDetailClick: handleThingDetailClick,
    }
  });
  
  const groupRowItem: GroupRowItem = {
    rows: rowItems,
  }

  const headerItem: HeaderItem = {
    title: ["...", thingGroup.groupName, "Things"],
    onDetailClick: handleAddThingClick
  }

  return (
    <>
      {showNewThingDialog && (
        <InputDialog 
          isVisible={showNewThingDialog}
          title={"New Thing"}
          subtitle={"Please enter a new Thing name to track."}
          label={"Thing Name"}
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
      <ListDialog
        isVisible={isVisible}
        headerItem={headerItem}
        onClose={handleCloseClick}
        groupRowItems={[groupRowItem]}
      />
      {/* <Dialog
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
          <Button variant="text" onClick={handleCancelClick}>Close</Button>
        </DialogActions>
      </Dialog> */}
    </>
  )
}