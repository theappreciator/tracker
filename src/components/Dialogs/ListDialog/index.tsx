import { Dialog, DialogTitle, Box, Typography, DialogContent, IconButton, DialogActions, Button, useMediaQuery, useTheme, Breadcrumbs } from "@mui/material"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import { Fragment } from "react";

export interface RowItem {
  id: string,
  leftText: string;
  rightText?: string;
  onDetailClick?: (rowItem: RowItem) => void;
}

export interface GroupRowItem {
  id?: string;
  leftText?: string;
  rightText?: string;
  onDetailClick?: (groupRowItem: GroupRowItem) => void;
  rows: RowItem[];
}

export interface HeaderItem {
  title: string | string[];
  onDetailClick?: () => void;
}

export default function ListDialog(
{
  isVisible,
  headerItem,
  groupRowItems,
  onClose,
} : {
  isVisible: boolean,
  headerItem: HeaderItem,
  groupRowItems: GroupRowItem[],
  onClose: () => void,
}
) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseClick = () => {
    onClose();
  }

  const handleGroupRowAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const itemId = event.currentTarget.dataset.itemid;
    const groupRowItem = groupRowItems.find(g => g.id === itemId);
    groupRowItem?.onDetailClick?.(groupRowItem);
  }

  const handleRowNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const groupItemId = event.currentTarget.dataset.groupitemid;
    const itemId = event.currentTarget.dataset.itemid;
    const groupRowItem = groupRowItems.find(g => g.id === groupItemId);
    const rowItem = groupRowItem?.rows.find(r => r.id === itemId);
    rowItem?.onDetailClick?.(rowItem);
  }

  return (
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
            {Array.isArray(headerItem.title) && (
              <Breadcrumbs separator="/" aria-label="breadcrumb">
                {headerItem.title.map((word, i) => (
                  <Typography key={`breadcrumb-${i + 1}`} color={i === (headerItem.title.length - 1) ? 'text.primary' : 'inherit'}>
                    {word}
                  </Typography>
                ))}
              </Breadcrumbs>
            )}
            {!Array.isArray(headerItem.title) && (
              <Fragment>
                {headerItem.title}
              </Fragment>
            )}
          </Typography>
          {headerItem.onDetailClick && (
            <IconButton sx={{ }} aria-label="add" size="large" onClick={headerItem.onDetailClick}>
              <AddIcon fontSize="inherit" />
            </IconButton>
          )}
      </Box>

      </DialogTitle>
      <DialogContent dividers={true}>
        {groupRowItems.map(groupRowItem => (
          <Fragment key={`groupRowItem-${groupRowItem.id}`}>
            {groupRowItem.id && (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <Typography
                  variant="h6"
                  sx={{ flexGrow: 1 }}
                >
                  {groupRowItem.leftText}
                </Typography>
                <IconButton sx={{ }} aria-label="add" size="large" data-itemid={groupRowItem.id} onClick={handleGroupRowAddClick}>
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </Box>
            )}
            {groupRowItem.rows.map(rowItem => {
              return (
                <Box key={`rowItem-${rowItem.id}`} sx={{ display: "flex", alignItems: "center", margin: 0 }}>
                  <Typography
                    sx={{ flexGrow: 1 }}
                  >
                    {rowItem.leftText}
                  </Typography>
                  <Typography>
                    {rowItem.rightText}
                  </Typography>
                  <IconButton aria-label="next" size="large" data-groupitemid={groupRowItem.id} data-itemid={rowItem.id} onClick={handleRowNextClick}>
                    <NavigateNextIcon fontSize="inherit"/>
                  </IconButton>
                </Box>
              )
            })}
          </Fragment>
        ))}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleCloseClick}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}