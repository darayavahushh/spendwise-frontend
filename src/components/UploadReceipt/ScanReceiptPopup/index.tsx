import { ChangeEvent, FC, useRef, useState } from "react";
import { Category } from "../../shared/types/Category";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ReceiptsApiClient } from "../../../api/Clients/ReceiptsApiClient";
import { CategorizedProduct } from "../../shared/types/CategorizedProduct";
import { ScannedProduct } from "../../shared/types/ScannedProduct";

import "./ScanReceiptPopup.css";

interface ScanReceiptPopupProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onScanning: (file: File, categorizedProducts: CategorizedProduct[]) => void;
}

export const ScanReceiptPopup: FC<ScanReceiptPopupProps> = ({
  open,
  onClose,
  categories,
  onScanning,
}: ScanReceiptPopupProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onCheckBoxClicked = (checked: boolean, category: Category) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((el) => el.id !== category.id)
      );
    }
  };

  const handleClose = () => {
    setFile(undefined);
    setSelectedCategories([]);
    onClose();
  };

  const handleScanReceipt = async () => {
    try {
      setIsLoading(true);

      if (file === undefined) return;

      const res = await ReceiptsApiClient.scanReceipt(file, selectedCategories);

      const categorizedProducts: CategorizedProduct[] = res.map(
        (model: any) => {
          return {
            id: model.id,
            name: model.name,
            products: model.products.map(
              (product: any) =>
                ({
                  name: product.name,
                  quantity: product.quantity,
                  price: product.price,
                } as ScannedProduct)
            ),
          };
        }
      );

      onScanning(file, categorizedProducts);

      handleClose();
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onCheckAllBoxesClicked = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }
  };

  const allCategoriesSelected = selectedCategories.length === categories.length;

  return (
    <Dialog fullWidth={true} maxWidth={"md"} open={open} onClose={handleClose}>
      <DialogTitle fontSize={24}>Upload a receipt</DialogTitle>
      <DialogContent className={"scan-receipt-modal-content"}>
        <Box className={"upload-receipt-button-container"}>
          <Box className={"upload-receipt-text"}>Upload a receipt</Box>
          <Button
            color="primary"
            variant="contained"
            onClick={handleUploadButtonClick}
          >
            <UploadFileIcon color="secondary" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          {file && (
            <Box className={"selected-file-text"}>
              Selected file: {file.name}
            </Box>
          )}
        </Box>
        <Box className={"select-categories-container"}>
          <Box className={"select-categories-text"}>Select categories</Box>
        </Box>
        <Box className={"select-all-categories-to-check"}>
          <Typography>Select all</Typography>
          <Checkbox
            checked={allCategoriesSelected}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onCheckAllBoxesClicked(event.target.checked)
            }
          />
        </Box>
        <Box className={"categories-container"}>
          {categories.map((category: Category, index: number) => (
            <Box key={index} className={"category-item"}>
              <Typography>{category.name}</Typography>
              <Checkbox
                checked={selectedCategories.some((el) => el.id === category.id)}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onCheckBoxClicked(event.target.checked, category)
                }
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions className={"scan-receipt-modal-actions"}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={"save-button"}
          disabled={file === undefined || selectedCategories.length === 0}
          onClick={handleScanReceipt}
        >
          Scan receipt
        </Button>
      </DialogActions>
      {isLoading && (
        <Box className="spinner-layout">
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
};
