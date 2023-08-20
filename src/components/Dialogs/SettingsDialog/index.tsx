import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useMediaQuery, useTheme, IconButton, Grid, Typography, Box, Toolbar, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputDialog from "../InputDialog";
import ThingGroupsDialog from "../ThingGroupsDialog";
import { IAction, IThingGroup } from "../../../../types";
import { useGlobalContext } from "../../../context";



export default function SettingsDialog(
{
  isVisible,
  onCancel,
  onSave,
}: {
  isVisible: boolean,
  onCancel: () => void,
  onSave: () => void,
}
) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [selectedGroupAndThings, setSelectedGroupAndThings] = useState<IThingGroup>();
  const [actions, setActions] = useState<IAction[]>([]);
  const [groupsAndThings, setGroupsAndThings] = useState<IThingGroup[]>([]);

  const {needsReload, didFirstLoad, setNeedsReload} = useGlobalContext();
  console.log(needsReload, didFirstLoad);

  const getInitialData = async () => {
    const loadActions = getActions();
    const loadGroupsAndThings = getGroupsAndThingsForUser();

    const [newActions, newGroupsAndThings] = await Promise.all([loadActions, loadGroupsAndThings]);

    console.log("initial data");
    console.log(newGroupsAndThings);
    setGroupsAndThings(newGroupsAndThings);
    setActions(newActions);
  }

  const getGroupsAndThingsForUser = async () => {
    const response = await fetch("/api/group");
    const newGroupsAndThings: IThingGroup[] = await response.json();
    return newGroupsAndThings;
  }

  const getActions = async () => {
    const response = await fetch("/api/action");
    const newActions: IAction[] = await response.json();
    return newActions;
  }
  
  const saveGroupName = async (groupName: string): Promise<void> => {
    const payload = {
      groupName
    };

    const response = await fetch("/api/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    const newGroupsAndThings: IThingGroup[] = await response.json();
    console.log("newGroupsAndThings");
    console.log(newGroupsAndThings);
    setGroupsAndThings(newGroupsAndThings);
  }

  const handleSaveClick = () => {
    onSave();
  }
  
  const handleCloseClick = () => {
    onCancel();
  }

  const handleAddGroupClick = () => {
    setShowNewGroupDialog(true);
  }

  const handleAddGroupSave = async (groupName: string): Promise<boolean> => {
    console.log("We should save the group", groupName);

    let success = false;
    await saveGroupName(groupName)
    .then(() => {
      success = true;
    })

    if (success) {
      setShowNewGroupDialog(false);
    }
    
    return success;
  }
  
  const handleAddGroupCancel = () => {
    setShowNewGroupDialog(false);
  }

  const handleGroupDetailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const groupId = event.currentTarget.dataset.groupid;
    if (groupId) {
      const groupOfThings = groupsAndThings.find(g => g.groupId.toString() === groupId );
      setSelectedGroupAndThings(groupOfThings);
    }
  }

  const handleThingGroupThingsSave = async (thingName: string): Promise<boolean> => {
    return true;
  }

  const handleThingGroupThingsCancel = () => {
    setSelectedGroupAndThings(undefined);
  }

  useEffect(() => {
    if (isVisible || needsReload) {
      getInitialData();
    }
  }, [isVisible, needsReload]);
  
  console.log("groups and things");
  console.log(groupsAndThings);

  return (
    <>
      {showNewGroupDialog && (
        <InputDialog 
          isVisible={showNewGroupDialog}
          onCancel={handleAddGroupCancel}
          onSave={handleAddGroupSave}
        />
      )}
      {selectedGroupAndThings && (
        <ThingGroupsDialog
          isVisible={!!selectedGroupAndThings}
          actions={actions}
          thingGroup={selectedGroupAndThings}
          onCancel={handleThingGroupThingsCancel}
        />
      )}
      <Dialog
        fullScreen={fullScreen}
        open={isVisible}
        onClose={handleCloseClick}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="responsive-dialog-title">
        <Box sx={{ display: "flex", alignItems: "center", margin: 0 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {"Settings"}
          </Typography>
        </Box>

        </DialogTitle>
        <DialogContent dividers={true}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
            >
              Your Thing Groups
            </Typography>
            <IconButton sx={{ }} aria-label="delete" size="large" onClick={handleAddGroupClick}>
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Box>
          {groupsAndThings.map(group => {
            return (
              <Box key={`group-${group.groupId}`} sx={{ display: "flex", alignItems: "center", margin: 0 }}>
                <Typography
                  sx={{ flexGrow: 1 }}
                >
                  {group.groupName}
                </Typography>
                <Typography>
                  {group.things.length} Things
                </Typography>
                <IconButton aria-label="group detail" size="large" data-groupid={group.groupId} onClick={handleGroupDetailClick}>
                  <NavigateNextIcon fontSize="inherit"/>
                </IconButton>
              </Box>
            )
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseClick}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}