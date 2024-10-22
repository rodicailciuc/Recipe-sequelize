import express from 'express';

import recipeControllers from '../controllers/recipe.js';

const router = express.Router();

const {
    getRecipes,
    getRecipe,
    getRecipeForm,
    addRecipe,
    updateRecipe,
    removeRecipes,
    getRecipeByUser
} = recipeControllers;
// routes

router.get('/recipes', getRecipes);
router.get('/recipe/:id', getRecipe);
router.get('/add-recipe', getRecipeForm);
router.post('/add-recipe', addRecipe);
router.put('/update-recipe/:id', updateRecipe);
router.delete('/delete-recipe/:id', removeRecipes);
router.get('/recipesByUser', getRecipeByUser);

export default router;
