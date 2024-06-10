import { Box, Button, Divider, IconButton } from "@mui/material";
import { FC, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { Category } from "../shared/types/Category";
import { CategoriesApiClient } from "../../api/Clients/CategoriesApiClients";
import { CategoryModel } from "../../api/Models/CategoryModel";

import "./Categories.css";
import { AddCategoryPopup } from "./AddCategoryPopup";
import { EditCategoryPopup } from "./EditCategoryPopup";

export const Categories: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // State for opening the edit mode
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null); // State for the current category being edited

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchCategories = async () => {
    try {
      const res = await CategoriesApiClient.getAllAsync();

      const categories = res.map((e: CategoryModel) => ({ ...e } as Category)); // ... is the spread operator in ts
      setCategories(categories);
    } catch (error: any) {
      console.log(error); // Good practice to print w/e we encounter from the server
    }
  };

  const deleteCategory = async (id?: number) => {
    if (!id) return;

    try {
      await CategoriesApiClient.deleteOneAsync(id);
      const newCategories = categories.filter((el) => el.id !== id);
      setCategories(newCategories);
    } catch (error: any) {
      console.log(error);
    }
  };

  const editCategory = async (updatedCategory: CategoryModel, id?: number) => {
    if (!id) return;

    try {
      const updatedCategoryData = await CategoriesApiClient.updateOneAsync(
        updatedCategory,
        id
      );

      const newCategories = categories.map(
        (category) => (category.id === id ? updatedCategoryData : category) // Make a new map where to add the updated category and keep all the rest from before
      );
      setCategories(newCategories);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleEditClick = (category: CategoryModel) => {
    setCurrentCategory(category);
    setEditOpen(true);
  };

  const handleUpdate = async (updatedCategory: CategoryModel) => {
    await editCategory(updatedCategory, updatedCategory.id);
    setEditOpen(false);
  };

  // Because it is tricky to call async code in React, we use this triggers that interect with our code
  // Now in 2024 we use:
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box>
      <Box className={"new-category-section"}>
        <Box className={"categories-title-text"}>Add a new category</Box>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          sx={{ color: "#fff" }}
          onClick={handleOpen}
        >
          <AddIcon fontSize="large" />
        </Button>
      </Box>

      <Divider />

      <Box className={"categories-list-section"}>
        <Box className={"categories-title-text"}>Current categories</Box>
        <Box className={"categories-list"}>
          {categories.map((category: Category, index: number) => (
            <Box key={`${category.id}-${index}`} className={"category"}>
              <Box className={"category-text-container"}>{category.name}</Box>
              <IconButton onClick={() => handleEditClick(category)}>
                <EditIcon color="primary" fontSize="large" />
              </IconButton>
              <IconButton onClick={() => deleteCategory(category.id)}>
                <CancelIcon color="primary" fontSize="large" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <AddCategoryPopup
        open={open}
        onClose={handleClose}
        onEditing={(category: Category) => {
          setCategories([...categories, category]);
        }}
        existingCategories={categories}
      />

      {currentCategory && (
        <EditCategoryPopup
          category={currentCategory}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onUpdate={handleUpdate}
          existingCategories={categories}
        />
      )}
    </Box>
  );
};
