
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, RecipeCategory } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please set the process.env.API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      nome: { type: Type.STRING, description: 'Nome da receita.' },
      categoria: { 
        type: Type.STRING, 
        description: 'Categoria da receita.',
        enum: Object.values(RecipeCategory)
      },
      carb: { type: Type.INTEGER, description: 'Total de carboidratos em gramas por porção.' },
      porcoes: { type: Type.STRING, description: 'Rendimento da receita, ex: "2 porções".' },
      tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Tags como "Rápido", "Sem glúten".' },
      ingredientes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Lista de ingredientes.' },
      modo_preparo: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Passos do modo de preparo.' },
      substituicoes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Lista de substituições seguras.' },
    },
    required: ['nome', 'categoria', 'carb', 'porcoes', 'ingredientes', 'modo_preparo']
  }
};

export const generateInitialRecipes = async (): Promise<Recipe[]> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }

  try {
    console.log("Generating initial recipes with Gemini...");
    const prompt = `Gere 25 receitas para diabéticos, variadas entre 'Café da Manhã', 'Almoço', 'Jantar', 'Lanches', e especialmente incluindo 5-7 opções de 'Doces & Massas' com baixo carboidrato. Para cada receita, forneça o nome, categoria, total de carboidratos em gramas por porção, o rendimento (porções), tags relevantes, uma lista de ingredientes, o modo de preparo em passos, e sugestões de substituições seguras (ex: açúcar por eritritol, farinha de trigo por farinha de amêndoas). O formato de saída deve ser um JSON. O nome da receita deve ser em português do Brasil. Garanta que as categorias sejam exatamente uma das seguintes: ${Object.values(RecipeCategory).join(', ')}.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const generatedRecipes = JSON.parse(jsonText);

    return generatedRecipes.map((recipe: Omit<Recipe, 'id'>, index: number) => ({
      ...recipe,
      id: index + 1,
    }));
  } catch (error) {
    console.error("Error generating recipes:", error);
    // Fallback to empty array or mock data in case of API failure
    return [];
  }
};
