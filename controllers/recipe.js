import db from '../models/index.js';

const Recipe = db.recipes;

const recipeControllers = {
    getRecipes: async (req, res) => {
        const token = req.cookies.token;
        try {
            const recipes = await Recipe.findAll();
            res.status(200).render('recipes', {
                recipes,
                token: token
            });
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server error from get recipes',
                message: 'Server error from get recipes'
            });
        }
    },
    getRecipe: async (req, res) => {
        const { id } = req.params;
        try {
            const recipe = await Recipe.findOne({ where: { id: id } });
            if (recipe) {
                res.status(200).render('recipe', {
                    recipe
                });
            } else {
                res.status(404).render('404', {
                    title: 'Recipe not found',
                    message: 'Recipe not found'
                });
            }
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server error from get recipe',
                message: 'Server error from get recipe'
            });
        }
    },
    getRecipeForm: (req, res) => {
        res.status(200).render('add-recipe');
    },
    addRecipe: async (req, res) => {
        const { title, ingredients, description, img } = req.body;
        try {
            const recipe = await Recipe.create({
                title,
                ingredients,
                description,
                img,
                user_id: req.cookies.id
            });
            res.status(201).redirect('/api/recipes');
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server error from add recipe',
                message: 'Server error from add recipe'
            });
        }
    },
    updateRecipe: async (req, res) => {
        const { id } = req.params;
        const { title, ingredients, description, img } = req.body;
        try {
            const recipe = await Recipe.update(
                {
                    title,
                    ingredients,
                    description,
                    img
                },
                { where: { id: id } }
            );
            res.status(302).redirect(`/api/recipes`);
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server error from update recipe',
                message: 'Server error from update recipe'
            });
        }
    },
    removeRecipes: async (req, res) => {
        const { id } = req.params;
        try {
            const recipe = await Recipe.destroy({ where: { id: id } });
            res.status(302).redirect('/api/recipes');
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server error from deleting recipe',
                message: 'Server error from deleting recipe'
            });
        }
    },
    getRecipeByUser: async (req, res) => {
        const { id, token } = req.cookies;
        try {
            const recipes = await Recipe.findAll({ where: { user_id: id } });
            res.status(200).render('recipes', {
                recipes,
                token: token
            });
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server error from get recipe by user',
                message: 'Server error from get recipe by user'
            });
        }
    }
};

export default recipeControllers;
