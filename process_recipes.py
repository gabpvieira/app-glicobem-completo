import json
import re

def categorize_recipe(title):
    title_lower = title.lower()
    
    if 'bolo' in title_lower:
        return 'bolos'
    if any(word in title_lower for word in ['mousse', 'pudim', 'doce', 'beijinho', 'cookie', 'biscoito', 
                                           'churros', 'maçã do amor', 'torta', 'flan', 'barrinha', 
                                           'chocolate', 'nutella', 'canjica', 'arroz doce', 'curau', 
                                           'rabanada', 'cupcake']):
        return 'sobremesas'
    if any(word in title_lower for word in ['frango', 'carne', 'peixe', 'peru', 'lombo', 'costeleta',
                                           'bacalhau', 'camarão', 'sardinha', 'picadinho', 'hamburgão',
                                           'almôndegas', 'rosbife', 'assado', 'galantina', 'badejo',
                                           'quibe', 'feijoada', 'picanha', 'lasanha', 'canelone',
                                           'estrogonofe', 'pimentões recheados', 'bisteca', 'nhoque',
                                           'macarrão', 'risoto']):
        return 'pratos-principais'
    if any(word in title_lower for word in ['pão', 'esfiha', 'pãozinho']):
        return 'paes'
    if any(word in title_lower for word in ['sopa', 'caldo', 'creme de']):
        return 'sopas'
    if 'salada' in title_lower:
        return 'saladas'
    if any(word in title_lower for word in ['vitamina', 'suco', 'bebida']):
        return 'bebidas'
    if any(word in title_lower for word in ['wrap', 'panqueca', 'tapioca', 'omelete', 'chips', 
                                           'crepe', 'tortinha']):
        return 'lanches'
    
    return 'lanches'  # categoria padrão

def estimate_time(instructions):
    total_steps = len(instructions)
    if total_steps <= 3:
        return '15 min'
    elif total_steps <= 6:
        return '30 min'
    elif total_steps <= 9:
        return '45 min'
    else:
        return '60 min'

def determine_difficulty(instructions):
    total_steps = len(instructions)
    if total_steps <= 4:
        return 'Fácil'
    elif total_steps <= 7:
        return 'Médio'
    else:
        return 'Difícil'

def generate_tags(ingredients, title):
    tags = []
    ingredients_text = ' '.join(ingredients).lower()
    title_lower = title.lower()
    
    if any(word in ingredients_text for word in ['integral', 'aveia', 'farelo']):
        tags.append('Integral')
    if any(word in ingredients_text for word in ['diet', 'adoçante', 'desnatado']):
        tags.append('Diet')
    if any(word in ingredients_text for word in ['proteína', 'frango', 'ovo']):
        tags.append('Alto Proteína')
    if 'light' in title_lower or 'light' in ingredients_text:
        tags.append('Light')
    if any(word in ingredients_text for word in ['fibra', 'aveia', 'linhaça']):
        tags.append('Rico em Fibras')
    
    return tags if tags else ['Saudável']

def get_category_icon(category):
    category_map = {
        'bolos': 'cake',
        'sobremesas': 'ice-cream',
        'pratos-principais': 'chef-hat',
        'lanches': 'sandwich',
        'bebidas': 'coffee',
        'paes': 'bread-slice',
        'saladas': 'salad',
        'sopas': 'bowl-hot'
    }
    return category_map.get(category, 'utensils')

def generate_simple_cover(title, category):
    """Gera uma capa simples apenas com o nome da receita"""
    return title.upper()

def process_recipes():
    # Ler o arquivo JSON
    with open('Receitas GlicoBem Json.txt', 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Parse do JSON
    recipes_data = json.loads(content)
    
    # Processar cada receita
    processed_recipes = []
    
    for i, recipe in enumerate(recipes_data, 1):
        title = recipe['titulo']
        ingredients = recipe['ingredientes']
        instructions = recipe['modo_preparo']
        nutritional_info = recipe['informacao_nutricional']
        
        category = categorize_recipe(title)
        time = estimate_time(instructions)
        difficulty = determine_difficulty(instructions)
        tags = generate_tags(ingredients, title)
        
        # Extrair informações nutricionais
        carbs = nutritional_info.get('carboidratos', '0g')
        calories = nutritional_info.get('calorias', '0 kcal')
        protein = nutritional_info.get('proteinas', '0g')
        fiber = nutritional_info.get('fibras', '0g')
        
        # Criar descrição baseada no título
        description = f"Deliciosa receita de {title.lower()}, preparada com ingredientes saudáveis e nutritivos."
        
        processed_recipe = {
            'id': i,
            'title': title,
            'category': category,
            'ingredients': ingredients,
            'instructions': instructions,
            'nutritionalInfo': f"Carboidratos: {carbs} | Fibras: {fiber} | Proteínas: {protein} | Calorias: {calories}",
            'time': time,
            'difficulty': difficulty,
            'carbs': carbs,
            'calories': calories,
            'protein': protein,
            'fiber': fiber,
            'image': generate_simple_cover(title, category),
            'description': description,
            'tags': tags,
            'prepTime': str(int(time.split()[0]) // 2) + ' min',
            'cookTime': str(int(time.split()[0]) - int(time.split()[0]) // 2) + ' min'
        }
        
        processed_recipes.append(processed_recipe)
    
    return processed_recipes

def generate_typescript_file(recipes):
    # Cabeçalho do arquivo
    content = '''// Receitas extraídas do arquivo JSON e categorizadas
export interface Recipe {
  id: number;
  title: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: string;
  time: string;
  difficulty: string;
  carbs: string;
  calories: string;
  protein: string;
  fiber: string;
  image: string;
  description: string;
  tags: string[];
  rating: number;
  prepTime: string;
  cookTime: string;
}

export const RECIPE_CATEGORIES = [
  { id: 'all', name: 'Todas', icon: 'utensils', count: 0 },
  { id: 'bolos', name: 'Bolos', icon: 'cake', count: 0 },
  { id: 'sobremesas', name: 'Sobremesas', icon: 'ice-cream', count: 0 },
  { id: 'pratos-principais', name: 'Pratos Principais', icon: 'chef-hat', count: 0 },
  { id: 'lanches', name: 'Lanches', icon: 'sandwich', count: 0 },
  { id: 'bebidas', name: 'Bebidas', icon: 'coffee', count: 0 },
  { id: 'paes', name: 'Pães', icon: 'bread-slice', count: 0 },
  { id: 'saladas', name: 'Saladas', icon: 'salad', count: 0 },
  { id: 'sopas', name: 'Sopas', icon: 'bowl-hot', count: 0 }
];

// Dados das receitas processadas do JSON
export const RECIPES: Recipe[] = [\n'''
    
    # Adicionar cada receita
    for i, recipe in enumerate(recipes):
        content += f"  {{\n"
        content += f"    id: {recipe['id']},\n"
        content += f"    title: \"{recipe['title']}\",\n"
        content += f"    category: \"{recipe['category']}\",\n"
        content += f"    ingredients: [\n"
        for ingredient in recipe['ingredients']:
            content += f"      \"{ingredient.replace('"', '\\"')}\",\n"
        content += f"    ],\n"
        content += f"    instructions: [\n"
        for instruction in recipe['instructions']:
            content += f"      \"{instruction.replace('"', '\\"')}\",\n"
        content += f"    ],\n"
        content += f"    nutritionalInfo: \"{recipe['nutritionalInfo']}\",\n"
        content += f"    time: \"{recipe['time']}\",\n"
        content += f"    difficulty: \"{recipe['difficulty']}\",\n"
        content += f"    carbs: \"{recipe['carbs']}\",\n"
        content += f"    calories: \"{recipe['calories']}\",\n"
        content += f"    protein: \"{recipe['protein']}\",\n"
        content += f"    fiber: \"{recipe['fiber']}\",\n"
        content += f"    image: \"{recipe['image']}\",\n"
        content += f"    description: \"{recipe['description']}\",\n"
        content += f"    tags: {json.dumps(recipe['tags'])},\n"

        content += f"    prepTime: \"{recipe['prepTime']}\",\n"
        content += f"    cookTime: \"{recipe['cookTime']}\"\n"
        content += f"  }}"
        if i < len(recipes) - 1:
            content += ","
        content += "\n"
    
    content += "];\n\n"
    content += "// Atualizar contadores das categorias\n"
    content += "RECIPE_CATEGORIES.forEach(category => {\n"
    content += "  if (category.id === 'all') {\n"
    content += "    category.count = RECIPES.length;\n"
    content += "  } else {\n"
    content += "    category.count = RECIPES.filter(recipe => recipe.category === category.id).length;\n"
    content += "  }\n"
    content += "});\n"
    
    return content

if __name__ == "__main__":
    print("Processando receitas...")
    recipes = process_recipes()
    print(f"Total de receitas processadas: {len(recipes)}")
    
    print("Gerando arquivo TypeScript...")
    typescript_content = generate_typescript_file(recipes)
    
    with open('data/recipes.ts', 'w', encoding='utf-8') as file:
        file.write(typescript_content)
    
    print("Arquivo recipes.ts gerado com sucesso!")
    print(f"Total de receitas: {len(recipes)}")
    
    # Mostrar estatísticas por categoria
    categories = {}
    for recipe in recipes:
        cat = recipe['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nEstatísticas por categoria:")
    for cat, count in categories.items():
        print(f"  {cat}: {count} receitas")