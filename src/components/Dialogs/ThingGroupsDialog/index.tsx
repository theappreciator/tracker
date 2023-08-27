import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, IconButton, Typography, ButtonGroup, ToggleButtonGroup, ToggleButton, Breadcrumbs, Link } from "@mui/material";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IAction, IThing, IThingGroup } from "../../../../types";
import ThingActionsDialog from "../ThingActionsDialog";
import GoalInputDialog from "../GoalInputDialog";
import ListDialog, { HeaderRowItem, HeaderItem, RowItem } from "../ListDialog";
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
  const [selectedThingForEdit, setSelectedThingForEdit] = useState<IThing>();
  const [showNewThingDialog, setShowNewThingDialog] = useState(false);
  const [showEditThingDialog, setShowEditThingDialog] = useState(false);
  const { setNeedsReload } = useGlobalContext();


  const [isSaving, setSaving] = useState(false);

  const saveThingName = async (thingName: string, goal: number): Promise<void> => {
    const payload = {
      thingGroupId: thingGroup.groupId,
      thingName,
      goal
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

  const updateThingName = async (thingId: number, thingName: string, goal: number): Promise<void> => {
    const payload = {
      thingName,
      goal
    };

    const response = await fetch(`/api/thing/${thingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    setNeedsReload(true);
  }

  const deleteThing = async (thingId: number): Promise<void> => {
    const response = await fetch(`/api/thing/${thingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setNeedsReload(true);
  }

  const handleAddThingClick = () => {
    setShowNewThingDialog(true);
  }

  const handleThingEditClick = (rowItem: RowItem) => {
    const thing = thingGroup.things.find(t => t.thingId.toString() === rowItem.id);
    setShowEditThingDialog(true);
    setSelectedThingForEdit(thing);
  }

  const handleAddThingSave = async (thingId: string, thingName: string, goal?: number): Promise<boolean> => {
    let success = false;
    await saveThingName(thingName, goal || 0)
    .then(() => {
      success = true;
    })

    if (success) {
      setShowNewThingDialog(false);
    }
    
    return success;
  }

  const handleEditThingSave = async (thingId: string, thingName: string, goal?: number): Promise<boolean> => {
    let success = false;
    await updateThingName(+thingId, thingName, goal || 0)
    .then(() => {
      success = true;
    })

    if (success) {
      setShowEditThingDialog(false);
    }
    
    return success;
  }

  const handleDeleteThingSave = async (thingId: string): Promise<boolean> => {
    let success = false;
    await deleteThing(+thingId)
    .then(() => {
      success = true;
    })

    if (success) {
      setShowEditThingDialog(false);
    }
    
    return success;  }

  const handleAddThingCancel = () => {
    setShowNewThingDialog(false);
  }

  const handleEditThingCancel = () => {
    setShowEditThingDialog(false);
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
      onEditClick: handleThingEditClick,
    }
  });
  
  const HeaderRowItem: HeaderRowItem = {
    rows: rowItems,
  }

  const headerItem: HeaderItem = {
    title: ["...", thingGroup.groupName, "Things"],
    onDetailClick: handleAddThingClick
  }

  return (
    <>
      {showNewThingDialog && (
        <GoalInputDialog 
          isVisible={showNewThingDialog}
          title={"New Thing"}
          subtitle={"Please enter a new Thing name to track."}
          label={"Thing Name"}
          prefillGoal={0}
          onCancel={handleAddThingCancel}
          onSave={handleAddThingSave}
        />
      )}
      {showEditThingDialog && selectedThingForEdit && (
        <GoalInputDialog 
          isVisible={showEditThingDialog}
          inputId={selectedThingForEdit?.thingId.toString()}
          title={"Edit Thing"}
          subtitle={"Please enter a new thing name.  WARNING"}
          label={"Thing Name"}
          prefillName={selectedThingForEdit.thingName}
          prefillGoal={selectedThingForEdit.goal}
          onCancel={handleEditThingCancel}
          onSave={handleEditThingSave}
          onDelete={handleDeleteThingSave}
          deleteMessage={`This will also delete all of your history for this thing.`}
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
        HeaderRowItems={[HeaderRowItem]}
      />
    </>
  )
}