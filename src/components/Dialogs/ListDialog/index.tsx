import { Dialog, DialogTitle, Box, Typography, DialogContent, IconButton, DialogActions, Button, useMediaQuery, useTheme, Breadcrumbs } from "@mui/material"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Fragment } from "react";

export interface RowItem {
  id: string,
  leftText: string;
  rightText?: string;
  onDetailClick?: (rowItem: RowItem) => void;
  onEditClick?: (HeaderRowItem: RowItem) => void;
}

export interface HeaderRowItem {
  id?: string;
  leftText?: string;
  rightText?: string;
  onDetailClick?: (HeaderRowItem: HeaderRowItem) => void;
  onEditClick?: (HeaderRowItem: HeaderRowItem) => void;
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
  HeaderRowItems,
  onClose,
} : {
  isVisible: boolean,
  headerItem: HeaderItem,
  HeaderRowItems: HeaderRowItem[],
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
    const HeaderRowItem = HeaderRowItems.find(g => g.id === itemId);
    HeaderRowItem?.onDetailClick?.(HeaderRowItem);
  }
  
  const handleGroupRowEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const itemId = event.currentTarget.dataset.itemid;
    const HeaderRowItem = HeaderRowItems.find(g => g.id === itemId);
    HeaderRowItem?.onEditClick?.(HeaderRowItem);
  }

  const handleRowNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const groupItemId = event.currentTarget.dataset.groupitemid;
    const itemId = event.currentTarget.dataset.itemid;
    const HeaderRowItem = HeaderRowItems.find(g => g.id === groupItemId);
    const rowItem = HeaderRowItem?.rows.find(r => r.id === itemId);
    rowItem?.onDetailClick?.(rowItem);
  }

  const handleRowEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const groupItemId = event.currentTarget.dataset.groupitemid;
    const itemId = event.currentTarget.dataset.itemid;
    const HeaderRowItem = HeaderRowItems.find(g => g.id === groupItemId);
    const rowItem = HeaderRowItem?.rows.find(r => r.id === itemId);
    rowItem?.onEditClick?.(rowItem);
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
        {HeaderRowItems.map(HeaderRowItem => (
          <Fragment key={`HeaderRowItem-${HeaderRowItem.id}`}>
            {HeaderRowItem.id && (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <Typography
                  variant="h6"
                  sx={{ flexGrow: 1 }}
                >
                  {HeaderRowItem.leftText}
                </Typography>
                <IconButton sx={{ }} aria-label="add" size="large" data-itemid={HeaderRowItem.id} onClick={handleGroupRowAddClick}>
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </Box>
            )}
            {HeaderRowItem.rows.map(rowItem => {
              return (
                <Box key={`rowItem-${rowItem.id}`} sx={{ display: "flex", alignItems: "center", margin: 0 }}>
                  <Typography
                  >
                    {rowItem.leftText}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    {rowItem.onEditClick && (
                      <IconButton aria-label="edit" size="large" data-groupitemid={HeaderRowItem.id} data-itemid={rowItem.id} onClick={handleRowEditClick}>
                        <EditIcon sx={{ fontSize: "1rem" }} />
                      </IconButton>
                    )}
                  </Box>
                  <Typography>
                    {rowItem.rightText}
                  </Typography>
                  <IconButton aria-label="next" size="large" data-groupitemid={HeaderRowItem.id} data-itemid={rowItem.id} onClick={handleRowNextClick}>
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