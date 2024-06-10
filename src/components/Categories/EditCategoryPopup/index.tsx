import { FC, useEffect, useState } from "react";
import { Category } from "../../shared/types/Category";
import { CategoriesApiClient } from "../../../api/Clients/CategoriesApiClients";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
} from "@mui/material";

interface EditCategoryModalProps {
  category: Category;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedCategory: Category) => void;
  existingCategories: Category[]; // Pass existing categories to check for duplicates
}

export const EditCategoryPopup: FC<EditCategoryModalProps> = ({
  category,
  open,
  onClose,
  onUpdate,
  existingCategories,
}: EditCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategoryName(category.name);
  }, [category]);

  const updateCategory = async () => {
    if (!category.id) return;
    const updatedCategory = { ...category, name: categoryName };

    try {
      const res = await CategoriesApiClient.updateOneAsync(
        updatedCategory,
        category.id
      );
      return res;
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setCategoryName(category.name);
    setError("");
    onClose();
  };

  const handleUpdate = async () => {
    const categoryExists = existingCategories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryExists) {
      setError(`${categoryName} category already exists.`);
      return;
    }

    const updatedCategoryModel = await updateCategory();
    if (updatedCategoryModel) {
      onUpdate(updatedCategoryModel);
      handleClose();
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth={"md"} open={open} onClose={onClose}>
      <DialogTitle fontSize={24}>Edit Category: {category.name}</DialogTitle>
      <DialogContent className={"edit-category-modal-content"}>
        <TextField
          fullWidth
          label="Category Name"
          value={categoryName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCategoryName(event.target.value);
            setError("");
          }}
          error={Boolean(error)}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
      </DialogContent>
      <DialogActions className={"edit-category-modal-actions"}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={!categoryName}
          className="update-button"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
