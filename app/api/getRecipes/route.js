import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { inventoryItems } = await request.json();

    if (!inventoryItems || inventoryItems.length === 0) {
      return NextResponse.json({ message: 'No inventory items provided' }, { status: 400 });
    }

    const itemList = inventoryItems.map(item => `${item.name} (quantity: ${item.quantity}, expires on: ${item.expirationDate})`).join(', ');
    
    const prompt = `You are an AI that specializes in suggesting recipes based on available ingredients. The user is interacting with an AI-powered pantry tracker called "StockSmart AI." Given the following list of ingredients, each with its quantity and expiration date: ${itemList}, generate 3 recipe suggestions that align with the system's features:
      1. **Smart Recipe Suggestions:** The recipes should be personalized based on the available ingredients and should utilize as many of them as possible to minimize waste.
      2. **Expiration Tracking:** Prioritize ingredients that are nearing their expiration date to help the user avoid waste.
      3. **Low Quantity Alerts:** Consider that some ingredients may be in low supply, so the recipes should be practical and require only small quantities of those items.
      Please ensure that the recipes are clear, concise, and easy to follow, and suitable for an average home cook. If some ingredients are versatile (e.g., eggs, flour), suggest different ways they could be used.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI assistant that specializes in helping users manage their pantry. You provide smart recipe suggestions based on the available inventory, taking into account the quantity and expiration dates of ingredients to minimize waste and optimize usage.'},
        { role: 'user', content: prompt },
      ],
      max_tokens: 3000,
    });

    const recipes = completion.choices[0].message.content.trim();
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    return NextResponse.json({ error: 'Failed to generate recipes' }, { status: 500 });
  }
}
