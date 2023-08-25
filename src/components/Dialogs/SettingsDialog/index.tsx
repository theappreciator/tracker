import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useMediaQuery, useTheme, IconButton, Grid, Typography, Box, Toolbar, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputDialog from "../InputDialog";
import ThingGroupsDialog from "../ThingGroupsDialog";
import { IAction, IThingGroup } from "../../../../types";
import { useGlobalContext } from "../../../context";
import ListDialog, { HeaderRowItem, HeaderItem, RowItem } from "../ListDialog";



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
  //#region React hooks

  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);
  const [selectedGroupAndThings, setSelectedGroupAndThings] = useState<IThingGroup>();
  const [selectedGroupAndThingsForEdit, setSelectedGroupAndThingsForEdit] = useState<IThingGroup>();
  const [actions, setActions] = useState<IAction[]>([]);
  const [groupsAndThings, setGroupsAndThings] = useState<IThingGroup[]>([]);

  const {needsReload, didFirstLoad, setNeedsReload} = useGlobalContext();

  useEffect(() => {
    if (isVisible || needsReload) {
      getInitialData();
      setSelectedGroupAndThings(undefined);
    }
  }, [isVisible, needsReload]);

//#endregion

//#region Actions to get and manipulate data for presenting

  const getInitialData = async () => {
    const loadActions = getActions();
    const loadGroupsAndThings = getGroupsAndThingsForUser();

    const [newActions, newGroupsAndThings] = await Promise.all([loadActions, loadGroupsAndThings]);

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
    setGroupsAndThings(newGroupsAndThings);
  }

  const updateGroupName = async (groupId: number, groupName: string) => {
    const payload = {
      groupName
    };

    const response = await fetch(`/api/group/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    const newGroupsAndThings: IThingGroup[] = await response.json();
    setGroupsAndThings(newGroupsAndThings);
  }

  const deleteGroup = async (groupId: number) => {
    const response = await fetch(`/api/group/${groupId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newGroupsAndThings: IThingGroup[] = await response.json();
    setGroupsAndThings(newGroupsAndThings);
  }

//#endregion
  
//#region Click handlers

  const handleCloseClick = () => {
    onCancel();
  }

  const handleAddGroupClick = (HeaderRowItem: HeaderRowItem) => {
    setShowNewGroupDialog(true);
  }

  const handleGroupDetailClick = (rowItem: RowItem) => {
    const groupOfThings = groupsAndThings.find(g => g.groupId.toString() === rowItem.id);
    setSelectedGroupAndThings(groupOfThings);
  }

  const handleGroupEditClick = (rowItem: RowItem) => {
    const groupOfThings = groupsAndThings.find(g => g.groupId.toString() === rowItem.id);
    setSelectedGroupAndThingsForEdit(groupOfThings);
    setShowEditGroupDialog(true);
  }

//#endregion

//#region Cancel Action Handlers

  const handleAddGroupCancel = () => {
    setShowNewGroupDialog(false);
  }

  const handleEditGroupCancel = () => {
    setShowEditGroupDialog(false);
  }

  const handleThingGroupThingsCancel = () => {
    setSelectedGroupAndThings(undefined);
  }

//#endregion

//#region Save Action Handlers

  const handleAddGroupSave = async (groupId: string, groupName: string): Promise<boolean> => {
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

  const handleEditGroupSave = async (groupId: string, groupName: string): Promise<boolean> => {
    let success = false;
    await updateGroupName(+groupId, groupName)
    .then(() => {
      success = true;
    })

    if (success) {
      setShowEditGroupDialog(false);
    }
    
    return success;
  }

  const handleDeleteGroupSave = async (groupId: string): Promise<boolean> => {
    let success = false;
    await deleteGroup(+groupId)
    .then(() => {
      success = true;
    })

    if (success) {
      setShowEditGroupDialog(false);
    }
    
    return success;  
  }



//#endregion
  
//#region Finalize data for presenting

  const rowItems: RowItem[] = groupsAndThings.map(group => {
    return {
      id: group.groupId.toString(),
      leftText: group.groupName,
      rightText: `${group.things.length} Things`,
      onDetailClick: handleGroupDetailClick,
      onEditClick: handleGroupEditClick,
    }
  });

  const HeaderRowItem: HeaderRowItem = {
    id: "1",
    leftText: "Your Group Items",
    rightText: undefined,
    onDetailClick: handleAddGroupClick,
    rows: rowItems,
  }

  const headerItem: HeaderItem = {
    title: "Settings"
  }

//#endregion

  return (
    <>
      {showNewGroupDialog && (
        <InputDialog 
          isVisible={showNewGroupDialog}
          title={"New Group"}
          subtitle={"Please enter a new group name.  Groups will contain Things."}
          label={"Group Name"}
          onCancel={handleAddGroupCancel}
          onSave={handleAddGroupSave}
        />
      )}
      {showEditGroupDialog && selectedGroupAndThingsForEdit && (
        <InputDialog 
          isVisible={showEditGroupDialog}
          inputId={selectedGroupAndThingsForEdit?.groupId.toString()}
          title={"Edit Group"}
          subtitle={"Please enter a new group name.  WARNING"}
          label={"Group Name"}
          prefill={selectedGroupAndThingsForEdit.groupName}
          onCancel={handleEditGroupCancel}
          onSave={handleEditGroupSave}
          onDelete={handleDeleteGroupSave}
          deleteMessage={`This will also delete all of your things and history for this group.`}
        />
      )}
      {selectedGroupAndThings && (
        <ThingGroupsDialog
          isVisible={!!selectedGroupAndThings}
          actions={actions}
          thingGroup={selectedGroupAndThings}
          onClose={handleThingGroupThingsCancel}
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